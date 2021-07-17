import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import {
  BehaviorSubject,
  merge,
  Observable,
  of,
  Subject,
  Subscription,
} from 'rxjs';
import {
  distinctUntilChanged,
  map,
  take,
  startWith,
  takeUntil,
  switchMap,
  tap,
  delay,
} from 'rxjs/operators';

import unique from 'lodash-es/uniq';
import toNumber from 'lodash-es/toNumber';

import {
  Almacen,
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
import { CatalogosService } from '@papx/data-access';

import * as cargosBuilder from '../../../utils/cargos';
import {
  recalcularPartidas,
  buildSummary,
  normalize,
  getClienteMostrador,
} from '../../../utils';
import { ItemController } from '../../ui-pedido-item';
import { AutorizacionesDePedido } from '../../../utils';
import * as cartUtils from '../../../utils/cart.utils';

import * as utils from '../pedido-form.utils';
import { PedidoForm } from '../pedido-form';
import { PedidoWarnings } from '../validation/pedido-warning';

import maxBy from 'lodash-es/maxBy';

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
  private reorderItems$ = new BehaviorSubject(this._reorderItems);

  private currentPedido: Pedido;
  private user: User;

  descuentos$ = this.catalogos.descuentos$;

  nextDescuento$ = this.partidas$.pipe(
    map((items: PedidoDet[]) =>
      this.isCredito()
        ? 0.0
        : this.descuentoEspecial <= 0.0
        ? cartUtils.calcularImporteBruto(items)
        : 0.0
    ),
    switchMap((neto) =>
      this.catalogos.descuentos$.pipe(
        map((descuentos) => {
          const next = descuentos.find((item) => item.inicial >= neto);
          return {
            netoAcual: neto,
            nextDescuento: next,
          };
        })
      )
    )
  );

  constructor(
    private itemController: ItemController,
    private clienteSelector: ClienteSelectorController,
    private clienteForm: ClienteFormController,
    private clienteDataService: ClientesDataService,
    private productoDataService: ProductoService,
    private catalogos: CatalogosService,
    private auth: AuthService,
    private fb: FormBuilder
  ) {
    auth.user$.pipe(take(1)).subscribe((user) => (this.user = user));
  }

  getPedido() {
    return this.currentPedido;
  }

  setPedido(data: Partial<Pedido>) {
    if (data.id) {
      this.currentPedido = data as Pedido;
      if (this.currentPedido.envio === null) {
        delete this.currentPedido.envio;
      }
    }
    let value: any = { ...data };
    if (data.sucursal && data.sucursalId) {
      const sucursalEntity = { id: data.sucursalId, nombre: data.sucursal };
      value = { ...value, sucursalEntity };
    }

    this.form.patchValue(value);
    if (data.partidas) {
      const summ = utils.getPedidoSummary(data);
      this._summary.next(summ);
      this._currentPartidas = value.partidas;
      this._partidas.next(this._currentPartidas);
      this.refreshCliente(data.cliente.id);
    }
  }

  private refreshCliente(id: string) {
    this.closeClienteSubs();
    this.liveClienteSub = this.clienteDataService
      .fetchLiveCliente(id)
      .subscribe((cte) => {
        const { cfdiMail, nombre } = cte;
        this.controls.cliente.setValue(cte);

        if (nombre && nombre !== 'MOSTRADOR') {
          this.form.get('nombre').setValue(nombre, { emitEvent: true });
        }

        // if (cfdiMail && cte.nombre !== 'MOSTRADOR') {
        //   console.log('Actualizando CfdiMail: ', cfdiMail);
        //   this.form.get('cfdiMail').setValue(cfdiMail, { emitEvent: true });
        // }

        if (cte.credito) {
          const usoDeCfdi = this.form.get('usoDeCfdi').value;
          if (!usoDeCfdi) {
            this.form.get('usoDeCfdi').setValue(cte.usoDeCfdi);
          }
          if (!this.currentPedido) {
            this.form.get('tipo').setValue(TipoDePedido.CREDITO);
          }
          this.recalcular();
        }
        this.actualizarValidaciones();
        this.form.markAsDirty();
      });
  }

  recalcular(descuentoEspecial = 0.0) {
    // console.debug(
    //   `Recalculando pedido ${
    //     descuentoEspecial > 0.0
    //       ? 'Descuento especial del: ' + descuentoEspecial
    //       : ''
    //   }`
    // );

    const tipo = this.tipo;
    const cliente = this.cliente;
    const formaDePago = this.form.get('formaDePago').value;
    // const descuentoEspecial = this.form.get('descuentoEspecial').value;
    // console.debug('Tipo: %s Forma de pago: %s', tipo, formaDePago);

    if (!cliente) return;

    const items = recalcularPartidas(
      this._currentPartidas,
      tipo,
      formaDePago,
      cliente,
      +descuentoEspecial
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

    if (descuentoEspecial <= 0.0) {
      this.form.get('descuentoEspecial').setValue(0.0);
    }

    this._summary.next(summary);
    this.form.patchValue(summary);
    this.actualizarValidaciones();
    // console.debug('Form value: ', this.resolvePedidoData());

    this.form.markAsDirty();
  }

  aplicarDescuentoEspecial(descuentoEspecial: number) {
    // console.debug('Aplicando descuento especial del: ', descuentoEspecial);

    const tipo = this.tipo;
    const formaDePago = this.form.get('formaDePago').value;
    // console.debug('Tipo: %s Forma de pago: %s', tipo, formaDePago);

    const items = recalcularPartidas(
      this._currentPartidas,
      tipo,
      formaDePago,
      this.cliente,
      +descuentoEspecial
    );
    this._currentPartidas = items;
    // console.debug('Partidas actualizadas:', items);

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
    // console.debug('Form value: ', this.resolvePedidoData());
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
      // console.log('Partida editada: ', newItem);
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

  setDescuentoEspecial(descuento: number) {
    // this.aplicarDescuentoEspecial(descuento);
    this.form
      .get('descuentoEspecial')
      .setValue(+descuento, { emitEvent: true, onlySelf: true });
    this.recalcular(+descuento);

    /*
    if (slinetly) {
      this.form
        .get('descuentoEspecial')
        .setValue(descuento, { emitEvent: false, onlySelf: true });
    } else {
      console.debug('Aplicando descuento especial: ', descuento);
      this.form.get('descuentoEspecial').setValue(descuento);
      this.recalcular();
    }
    */
    return this;
  }

  getCargoPorManiobra() {
    const item: Partial<PedidoDet> = this._currentPartidas.find(
      (item) => item.clave === 'MANIOBRAF'
    );
    return item ? item.precio : 0.0;
  }

  setCargoPorManiobra(importe: number) {
    console.debug('Cargo por maniobra: ', importe);
    // this.recalcular(+descuento);
    let item: Partial<PedidoDet> = this._currentPartidas.find(
      (item) => item.clave === 'MANIOBRAF'
    );
    if (!item) {
      item = cargosBuilder.generarCargoPorFlete();
    }
    item.producto.precioContado = importe;
    item.producto.precioCredito = importe;
    item.precio = importe;
    item.precioLista = importe;
    item.precioOriginal = importe;

    const items = [
      ...this._currentPartidas.filter((item) => item.clave !== 'MANIOBRAF'),
      item,
    ];
    this._currentPartidas = items;
    this._partidas.next(this._currentPartidas);
    this.recalcular();
  }

  getTipoDeEnvio() {
    const envioForm = this.form.get('envio');
    if (!envioForm || envioForm.disabled) return null;
    return envioForm.get('tipo').value;
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
        this.form.get('cfdiMail').setValue(selected.cfdiMail);
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
    // this.form.get('cfdiMail').setValue(cliente.cfdiMail);
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
  getPartidas() {
    return this._currentPartidas;
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
    const { sucursalEntity, envio, ...rest } = this.form.value;
    const maxOriginal = maxBy(this._currentPartidas, 'descuentoOriginal');
    const descuentoOriginal = maxOriginal ? maxOriginal.descuentoOriginal : 0.0;
    this._currentPartidas = this._currentPartidas.map((item) => {
      return {
        ...item,
        producto: utils.reduceProducto(item.producto),
        descripcion: item.producto.descripcion,
      };
    });
    const res = {
      ...rest,
      descuentoOriginal,
      cliente: utils.reduceCliente(this.cliente),
      partidas: [...this._currentPartidas],
      autorizacionesRequeridas: this._autorizaciones,
    };
    if (this.currentPedido && this.currentPedido.warnings) {
      res.warnings = [...this.currentPedido.warnings];
    }
    if (envio && envio.tipo) {
      res.envio = envio;
    } else {
      res.envio = null;
    }
    return res;
  }

  getExistenciaActual(item: Partial<PedidoDet>) {
    return this.productoDataService.fetchById(item.productoId).pipe(take(1));
  }

  updateItem(item: Partial<PedidoDet>, index: number) {
    const partidas = [...this._currentPartidas];
    partidas[index] = item;
    this._partidas.next(partidas);
  }

  /**
   *
   * @returns Public API para actualizar las existencias del pedido
   */
  actualizarExistencias(): Observable<any> {
    const sucursal = this.form.get('sucursal').value;
    let sname = sucursal.toLowerCase();
    if (sname === 'calle 4') sname = 'calle4';
    if (sname === 'vertiz 176') sname = 'vertis176';

    const items = [...normalize(this._currentPartidas)];

    const current: Partial<PedidoDet>[] = items;
    const ids = unique(current.map((item) => item.productoId));
    const tasks: Observable<Producto>[] = [];
    ids.forEach((id) => {
      const task = this.productoDataService.fetchById(id).pipe(take(1));
      tasks.push(task);
    });

    return merge(...tasks).pipe(
      tap((p) => {
        // console.log('Actualizando disponible de %s', p.clave);
        const found = current.filter((item) => item.clave === p.clave);
        // console.log('Fou');
        /*
        const current: Partial<PedidoDet>[] = [...this._currentPartidas];
        const found = current.filter((item) => item.clave === p.clave);
        found.forEach((item, index) => {
          console.log(
            'Actualizando disponible de %s index:%f',
            item.clave,
            index
          );
          item.producto.existencia = p.existencia;
          const res = this.actualizarDisponible(item, p.existencia, sname);
          current[index] = res;
        });
        this._currentPartidas = [...current];
        this._partidas.next(this._currentPartidas);
        */
      })
    );
  }

  /**
   * Public API para enviar el pedido por email
   *
   * @returns
   */
  enviarPedido(): Observable<any> {
    const sucursal = this.form.get('sucursal').value;
    let sname = sucursal.toLowerCase();
    if (sname === 'calle 4') sname = 'calle4';
    if (sname === 'vertiz 176') sname = 'vertis176';
    return of(sucursal).pipe(delay(2000));
  }

  private actualizarDisponible(
    item: Partial<PedidoDet>,
    exis: { [id: string]: Almacen },
    sucursal: string
  ): Partial<PedidoDet> {
    /*
    console.log(
      '---- Actualizando disponible Sucursal: %s  Prod: %s',
      sucursal,
      item.clave
    );
    */
    const cant = item.cantidad;
    if (exis) {
      const disp = exis[sucursal] ? toNumber(exis[sucursal].cantidad) : 0;
      item.faltante = disp > cant ? 0 : cant - disp;
      item.disponible = disp;
    } else {
      item.faltante = cant;
      item.disponible = 0;
    }
    return item;
  }

  closeLiveSubscriptions() {
    // console.log('Closing live subscriptions....');
    this.closeClienteSubs();
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  private closeClienteSubs() {
    if (this.liveClienteSub) {
      this.liveClienteSub.unsubscribe();
    }
  }

  public actualizarValidaciones() {
    // console.groupCollapsed('---- Actualizando validaciones -------');
    this.warnings();
    this.autorizaciones();
    // console.groupEnd();
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
    this._warnings.next(warnings);
  }

  private autorizaciones() {
    this._autorizaciones = null;
    const items = this._currentPartidas;
    const descuentoEspecial = this.descuentoEspecial ?? 0.0;
    const aut = AutorizacionesDePedido.Requeridas(items, descuentoEspecial);
    this._autorizaciones = aut;
    this.autorizaciones$.next(this._autorizaciones);
  }

  cleanForm() {
    if (!this.getPedido()) {
      const cleanValue: Partial<Pedido> = {
        cliente: getClienteMostrador(),
        nombre: 'MOSTRADOR',
        partidas: [],
      };
      // this.form.reset();
      this.setPedido(cleanValue);
      this.form.markAsPending();
    }
  }
}
