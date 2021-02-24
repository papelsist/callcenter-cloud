import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import {
  Cliente,
  Pedido,
  PedidoDet,
  PedidoSummary,
  TipoDePedido,
} from '@papx/models';
import { ClientesDataService } from '@papx/shared/clientes/@data-access/clientes-data.service';
import { ClienteSelectorController } from '@papx/shared/clientes/cliente-selector';
import { recalcularPartidas, buildSummary } from '../../../utils';
import { ItemController } from '../../ui-pedido-item';
import { PedidoForm } from '../pedido-form';

interface State {
  partidas: Partial<PedidoDet>[];
}

@Injectable()
export class PcreateFacade {
  readonly form = new PedidoForm(this.fb);

  readonly controls = {
    cliente: this.form.get('cliente'),
    sucursal: this.form.get('sucursal'),
    formaDePago: this.form.get('formaDePago'),
    tipo: this.form.get('tipo'),
  };

  private _currentPartidas = [];
  private _partidas = new BehaviorSubject<Partial<PedidoDet>[]>([]);
  partidas$ = this._partidas.asObservable();
  cortes$ = this.partidas$.pipe(map((items) => items.filter((it) => it.corte)));

  _summary = new BehaviorSubject<PedidoSummary>({
    importe: 0.0,
    descuento: 0.0,
    descuentoImporte: 0.0,
    subtotal: 0.0,
    impuesto: 0.0,
    total: 0.0,
  });

  summary$: Observable<PedidoSummary> = this._summary.asObservable();
  liveClienteSub: Subscription;

  private _store: State = {
    partidas: [],
  };
  private store = new BehaviorSubject<State>(this._store);

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
  constructor(
    private itemController: ItemController,
    private clienteController: ClienteSelectorController,
    private fb: FormBuilder,
    private clienteDataService: ClientesDataService
  ) {}

  setPedido(data: Partial<Pedido>) {
    console.log('Registrando datos iniciales del pedido: ', data);
    let value: any = { ...data };
    if (data.sucursal && data.sucursalId) {
      const sucursalEntity = { id: data.sucursalId, nombre: data.sucursal };
      value = { ...value, sucursalEntity };
    }
    this.form.patchValue(value, { emitEvent: false, onlySelf: true });
    if (data.id) {
      const {
        importe,
        descuento,
        descuentoImporte,
        subtotal,
        impuesto,
        total,
      } = data;
      this._summary.next({
        importe,
        descuento,
        descuentoImporte,
        subtotal,
        impuesto,
        total,
      });
      this.setPartidas(data.partidas);
      this.registrarLiveClienteChanges(data.cliente.id);
    }
  }

  registrarLiveClienteChanges(id: string) {
    console.log('Registrando live changes....');
    this.liveClienteSub = this.clienteDataService
      .fetchLiveCliente(id)
      // .pipe(take(1))
      .subscribe((cte) => {
        console.log('Live cliente: ', cte);
        const { cfdiMail, nombre } = cte;
        this.controls.cliente.setValue(cte);
        this.form.get('cfdiMail').setValue(cfdiMail, { emitEvent: false });
        this.form.get('nombre').setValue(nombre, { emitEvent: false });
      });
  }

  recalcular() {
    const tipo = this.tipo;
    const cliente = this.cliente;
    const formaDePago = this.form.get('formaDePago').value;
    const descuentoEspecial = this.form.get('descuentoEspecial').value;

    const config = { tipo, formaDePago, cliente, descuentoEspecial };
    console.log('Recalculando pedido: ', config);

    const items = recalcularPartidas(
      this._currentPartidas,
      tipo,
      formaDePago,
      cliente,
      descuentoEspecial
    );
    this._currentPartidas = items;
    this._partidas.next(this._currentPartidas);

    const summary = buildSummary(this._currentPartidas);
    this._summary.next(summary);
    this.form.patchValue(summary);
    this.form.markAsDirty();
  }

  setPartidas(value: Partial<PedidoDet>[]) {
    this._currentPartidas = value;
    this._partidas.next(this._currentPartidas);
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
      tipo: this.isCredito ? 'CREDITO' : 'TODOS',
    };
    const selected = await this.clienteController.selectCliente(props);
    if (selected) {
      this.setCliente(selected);
    }
  }

  setCliente(cliente: Partial<Cliente>) {
    this.controls.cliente.setValue(cliente);
    this.form.get('cfdiMail').setValue(cliente.cfdiMail, { emitEvent: false });
    this.form.get('nombre').setValue(cliente.nombre, { emitEvent: false });

    // Side effect to update other controls
    if (cliente.credito) {
      if (this.tipo !== TipoDePedido.CREDITO) {
        this.controls.tipo.setValue(TipoDePedido.CREDITO, {
          emitEvent: false,
          onlySelf: true,
        });
      }
    }
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
  get sucursal() {
    return this.form.get('sucursal').value;
  }

  isCredito() {
    return this.tipo === TipoDePedido.CREDITO;
  }

  resolvePedidoData(): Partial<Pedido> {
    const { sucursalEntity, ...rest } = this.form.value;
    return {
      ...rest,
      cliente: this.cleanCliente(),
      partidas: [...this._currentPartidas],
    };
  }

  private cleanCliente() {
    const { id, nombre, rfc, clave } = this.cliente;
    return {
      id,
      nombre,
      rfc,
      clave,
    };
  }

  closeLiveSubscriptions() {
    if (this.liveClienteSub) {
      console.log('Closing live subscription...');
      this.liveClienteSub.unsubscribe();
    }
  }
}
