import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ModalController } from '@ionic/angular';

import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import {
  distinctUntilChanged,
  map,
  take,
  startWith,
  takeUntil,
} from 'rxjs/operators';

import unique from 'lodash-es/uniq';
import toNumber from 'lodash-es/toNumber';

import {
  Cliente,
  FormaDePago,
  Pedido,
  PedidoDet,
  PedidoSummary,
  Producto,
  TipoDePedido,
  User,
  Warning,
} from '@papx/models';
import { AuthService } from '@papx/auth';
import { ClientesDataService } from '@papx/shared/clientes/@data-access/clientes-data.service';
import { ProductoService } from '@papx/shared/productos/data-access';
import { ClienteSelectorController } from '@papx/shared/clientes/cliente-selector';
import { ClienteFormController } from '@papx/shared/clientes/cliente-form/cliente-form.controller';

import * as cargosBuilder from '../../../utils/cargos';
import { recalcularPartidas, buildSummary } from '../../../utils';
import { ItemController } from '../../ui-pedido-item';
import { AutorizacionesDePedido } from '../../../utils';

import * as utils from '../pedido-form.utils';
import { PedidoForm } from '../pedido-form';
import { PedidoWarnings } from '../validation/pedido-warning';
import { CatalogosService } from '@papx/data-access';

@Injectable()
export class PcreateFacade {
  readonly form = new PedidoForm(this.fb);

  readonly controls = {
    cliente: this.form.get('cliente'),
    sucursal: this.form.get('sucursal'),
    formaDePago: this.form.get('formaDePago'),
    tipo: this.form.get('tipo'),
  };

  private _currentPartidas: any[] = [];
  private _partidas = new BehaviorSubject<Partial<PedidoDet>[]>([]);
  partidas$ = this._partidas.asObservable();
  cortes$ = this.partidas$.pipe(map((items) => items.filter((it) => it.corte)));

  _summary = new BehaviorSubject<PedidoSummary>(utils.zeroSummary());
  summary$: Observable<PedidoSummary> = this._summary.asObservable();

  liveClienteSub: Subscription;

  errors$ = this.form.statusChanges.pipe(
    startWith('VALID'),
    map(() => {
      const errors = [];
      if (this.form.errors) errors.push(this.form.errors);
      if (this.form.get('envio').enabled) {
        const envio = this.form.get('envio') as FormGroup;
        if (envio.errors) errors.push(envio.errors);
      }
      return errors;
    })
  );

  private _warnings = new Subject<Warning[]>();
  warnings$ = this._warnings.asObservable();

  private _autorizaciones = null;
  autorizaciones$ = new Subject<string>();

  productos$ = this.partidas$.pipe(
    map((items) => items.map((item) => item.clave)),
    map((claves) => unique(claves)),
    distinctUntilChanged()
  );

  destroy$ = new Subject<boolean>();

  private _reorderItems = false;
  reorderItems$ = new BehaviorSubject(this._reorderItems);

  private currentPedido: Pedido;
  private user: User;

  descuentos$ = this.catalogos.descuentos$;

  constructor(
    private itemController: ItemController,
    private clienteSelector: ClienteSelectorController,
    private clienteForm: ClienteFormController,
    private clienteDataService: ClientesDataService,
    private productoDataService: ProductoService,
    private catalogos: CatalogosService,
    auth: AuthService,
    private fb: FormBuilder,
    private modal: ModalController
  ) {
    auth.user$.pipe(take(1)).subscribe((user) => (this.user = user));
  }

  getPedido() {
    return this.currentPedido;
  }

  setPedido(data: Partial<Pedido>) {
    // console.log('Registrando datos iniciales del pedido: ', data);
    if (data.id) {
      this.currentPedido = data as Pedido;
    }
    let value: any = { ...data };
    if (data.sucursal && data.sucursalId) {
      const sucursalEntity = { id: data.sucursalId, nombre: data.sucursal };
      value = { ...value, sucursalEntity };
    }
    this.form.patchValue(value);
    if (data.id) {
      const summ = utils.getPedidoSummary(data);
      this._summary.next(summ);
      this._currentPartidas = value.partidas;
      this._partidas.next(this._currentPartidas);
      this.refreshCliente(data.cliente.id);
    }
  }

  private refreshCliente(id: string) {
    // console.log('Registrando Live CLIENTE ');
    this.closeClienteSubs();
    this.liveClienteSub = this.clienteDataService
      .fetchLiveCliente(id)
      .subscribe((cte) => {
        const { cfdiMail, nombre } = cte;
        this.controls.cliente.setValue(cte);
        this.form.get('nombre').setValue(nombre, { emitEvent: true });
        if (cfdiMail)
          this.form.get('cfdiMail').setValue(cfdiMail, { emitEvent: true });
        if (cte.credito) {
          this.recalcular();
        }
        // console.log('Cliente actualizado: ', cte);
        this.actualizarValidaciones();
      });
  }

  recalcular() {
    const tipo = this.tipo;
    const cliente = this.cliente;
    const formaDePago = this.form.get('formaDePago').value;
    const descuentoEspecial = this.form.get('descuentoEspecial').value;
    if (!cliente) return;

    const items = recalcularPartidas(
      this._currentPartidas,
      tipo,
      formaDePago,
      cliente,
      descuentoEspecial
    );
    this._currentPartidas = items;

    ///______ APLICAR CARGOS ______//
    const cargos = this.aplicarCargos(items, tipo, formaDePago);
    if (cargos.length > 0) {
      const newItems = [...items, ...cargos];
      this._currentPartidas = [...newItems];
    }

    this._partidas.next(this._currentPartidas);

    const summary = buildSummary(this._currentPartidas);
    this._summary.next(summary);
    this.form.patchValue(summary);
    this.actualizarValidaciones();
    this.form.markAsDirty();
  }

  private aplicarCargos(
    items: Partial<PedidoDet>[],
    tipo: TipoDePedido,
    fp: FormaDePago
  ) {
    const res: Partial<PedidoDet>[] = [];
    if (fp === FormaDePago.TARJETA_CRE || fp === FormaDePago.TARJETA_DEB) {
      const cargoPorTarjeta = cargosBuilder.generarCargoPorTarjeta(
        items,
        tipo,
        fp
      );
      if (cargoPorTarjeta) {
        res.push(cargoPorTarjeta);
      }
    }
    const cargoPorCorte = cargosBuilder.generarCargoPorCorte(items);
    if (cargoPorCorte) {
      res.push(cargoPorCorte);
    }

    return res;
  }

  async addItem() {
    const item = await this.itemController.addItem(this.tipo, this.sucursal);
    if (item) {
      this._currentPartidas = [...this._currentPartidas, item];
      this._partidas.next(this._currentPartidas);
      this.recalcular();
    }
    return this;
  }

  async editItem(index: number, item: Partial<PedidoDet>) {
    const newItem = await this.itemController.editItem(
      item,
      this.tipo,
      this.sucursal
    );
    if (newItem) {
      const clone = [...this._currentPartidas];
      clone[index] = newItem;
      this._currentPartidas = [...clone];
      this._partidas.next(this._currentPartidas);
      this.recalcular();
    }
    return this;
  }
  async deleteItem(index: number) {
    const partidas = [...this._currentPartidas];
    partidas.splice(index, 1);
    this._currentPartidas = partidas;
    this._partidas.next(this._currentPartidas);
    this.recalcular();
  }

  async copiarItem(index: number) {
    const partidas = [...this._currentPartidas];
    const item = partidas[index];
    const { id, ...duplicado } = item;
    partidas.splice(index, 0, duplicado);
    this._currentPartidas = partidas;
    this._partidas.next(this._currentPartidas);
    this.recalcular();
  }

  async reordenarPartidas(from: number, to: number) {
    if (this.form.enabled) {
      // console.log('Reordenando de %f al %f', from, to);
      const items = [...this._currentPartidas];
      const elm = items.splice(from, 1)[0];
      items.splice(to, 0, elm);

      this._currentPartidas = [...items];
      this._partidas.next(this._currentPartidas);
      this.form.markAsDirty();
    }
  }

  removeItem(index: number) {
    this._currentPartidas.splice(index, 1);
    this._partidas.next(this._currentPartidas);
    this.recalcular();
  }

  setDescuentoEspecial(descuento: number, slinetly = false) {
    if (slinetly) {
      this.form
        .get('descuentoEspecial')
        .setValue(descuento, { emitEvent: false, onlySelf: true });
    } else {
      this.form.get('descuentoEspecial').setValue(descuento);
      this.recalcular();
    }
    return this;
  }

  async cambiarCliente() {
    const props = {
      tipo: this.isCredito() ? 'CREDITO' : 'TODOS',
    };
    const selected = await this.clienteSelector.selectCliente(props);
    if (selected === 'CLIENTE_NUEVO') {
      this.registrarClienteNuevo();
    } else {
      if (selected) {
        this.setCliente(selected);
      }
    }
  }

  async registrarClienteNuevo() {
    const cliente = await this.clienteForm.clienteNuevo(this.user);
    if (cliente) {
      this.setCliente(cliente);
    }
  }

  private setCliente(cliente: Partial<Cliente>) {
    this.controls.cliente.setValue(cliente);
    this.form.get('cfdiMail').setValue(cliente.cfdiMail);
    this.form.get('nombre').setValue(cliente.nombre);
    if (cliente.credito)
      // Solo para clientes de credito vale la pena
      this.refreshCliente(cliente.id);
    this.recalcular();
  }

  get tipo() {
    return this.controls.tipo.value;
  }

  get cliente() {
    return this.controls.cliente.value;
  }

  get descuentoEspecial() {
    return this.form.get('descuentoEspecial').value;
  }
  get sucursal(): string {
    return this.form.get('sucursal').value;
  }

  isCredito() {
    return this.tipo === TipoDePedido.CREDITO;
  }

  toggleReorer() {
    if (this.form.enabled) {
      this._reorderItems = !this._reorderItems;
      this.reorderItems$.next(this._reorderItems);
    }
  }

  resolvePedidoData(): Partial<Pedido> {
    const { sucursalEntity, ...rest } = this.form.value;
    this._currentPartidas = this._currentPartidas.map((item) => {
      return {
        ...item,
        producto: utils.reduceProducto(item.producto),
      };
    });
    const res = {
      ...rest,
      cliente: utils.reduceCliente(this.cliente),
      partidas: [...this._currentPartidas],
      autorizacionesRequeridas: this._autorizaciones,
    };
    if (this.currentPedido && this.currentPedido.warnings) {
      res.warnings = [...this.currentPedido.warnings];
    }
    return res;
  }

  actualizarProductos() {
    console.log('Actualizando productos.....');
    const current: Partial<PedidoDet>[] = [...this._currentPartidas];
    const claves = unique(current.map((item) => item.clave));
    claves.forEach((clave) => {
      this.productoDataService
        .findByClave(clave)
        .pipe(
          // tap((p) => console.log('Change event: %s ', p.clave, p)),
          takeUntil(this.destroy$) // Esta es la clave para LiveUpdate the Firebase
        )
        .subscribe((prod) => this.actualizarProducto(prod, current));
    });
  }

  actualizarProducto(prod: Producto, current: Partial<PedidoDet>[]) {
    current.forEach((item) => {
      if (item.producto.clave === prod.clave) {
        item.producto = prod;
        item.descripcion = prod.descripcion;
        this.actualizarDisponible(item);
      }
    });
    this._currentPartidas = current;
    this._partidas.next(this._currentPartidas);
  }

  private actualizarDisponible(item: Partial<PedidoDet>): Partial<PedidoDet> {
    const exis = item.producto.existencia;
    if (exis) {
      const cant = item.cantidad;
      const disp = Object.keys(exis).reduce(
        (p, c) => p + toNumber(exis[c].cantidad),
        0.0
      );
      item.faltante = disp > cant ? 0 : cant - disp;
    }
    return item;
  }

  public actualizarExistenciasDeSucursal(sucursal: string) {
    let sname = sucursal.toLowerCase();
    if (sname === 'calle 4') sname = 'calle4';
    if (sname === 'vertiz 176') sname = 'vertis176';

    this._currentPartidas.forEach((item) => {
      const prod = item.producto;
      if (prod.existencia) {
        const exis = prod.existencia;
        const almacen = exis[sname];
        if (almacen) {
          console.log('Almacen: ', almacen);
          const actual = toNumber(almacen.cantidad);
          const faltante =
            item.cantidad - actual <= 0 ? 0 : item.cantidad - actual;
          console.log(
            'Prod: %s Requerido: %f Exis: %f Faltante %f',
            prod.clave,
            item.cantidad,
            actual,
            faltante
          );
        }
      }
    });
  }

  closeLiveSubscriptions() {
    console.log('Closing live subscriptions....');
    this.closeClienteSubs();
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  private closeClienteSubs() {
    if (this.liveClienteSub) {
      console.log('Closing live cliente subscription...');
      this.liveClienteSub.unsubscribe();
    }
  }

  public actualizarValidaciones() {
    console.groupCollapsed('---- Actualizando validaciones -------');
    this.warnings();
    this.autorizaciones();
    console.groupEnd();
  }

  private warnings() {
    const { cliente, tipo } = this;
    const items = this._currentPartidas;
    const descuentoEspecial = this.descuentoEspecial ?? 0.0;
    const warnings = PedidoWarnings.runWarnings(
      cliente,
      tipo,
      descuentoEspecial,
      items
    );
    if (this.currentPedido) {
      this.currentPedido.warnings = warnings;
    }
    console.log('Warnings: ', warnings);
    this._warnings.next(warnings);
  }

  private autorizaciones() {
    this._autorizaciones = null;
    const items = this._currentPartidas;
    const descuentoEspecial = this.descuentoEspecial ?? 0.0;
    const aut = AutorizacionesDePedido.Requeridas(items, descuentoEspecial);
    // console.log('Autorizacion requerida: ', aut);
    this._autorizaciones = aut;
    this.autorizaciones$.next(this._autorizaciones);
  }
}
