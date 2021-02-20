import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { Pedido, PedidoDet, PedidoSummary, TipoDePedido } from '@papx/models';
import { recalcularPartidas, buildSummary } from '../../../utils';
import { ItemController } from '../../ui-pedido-item';

import * as test from './test.data';

interface State {
  partidas: Partial<PedidoDet>[];
}

@Injectable()
export class PcreateFacade {
  readonly form: FormGroup = new FormGroup({
    cliente: new FormControl(null, Validators.required),
    sucursal: new FormControl(null, Validators.required),
    formaDePago: new FormControl(null, Validators.required),
    tipo: new FormControl(null, Validators.required),
    moneda: new FormControl(
      { value: 'MXN', disabled: true },
      Validators.required
    ),
    comprador: new FormControl(null),
    comentario: new FormControl(null),
    descuentoEspecial: new FormControl(null),
  });

  readonly controls = {
    cliente: this.form.get('cliente'),
    sucursal: this.form.get('sucursal'),
    formaDePago: this.form.get('formaDePago'),
    tipo: this.form.get('tipo'),
  };

  private _currentPartidas = [];
  private _partidas = new BehaviorSubject<Partial<PedidoDet>[]>([]);
  partidas$ = this._partidas.asObservable();

  _summary = new BehaviorSubject<PedidoSummary>({
    importe: 0.0,
    descuento: 0.0,
    descuentoImporte: 0.0,
    subtotal: 0.0,
    impuesto: 0.0,
    total: 0.0,
  });

  summary$: Observable<PedidoSummary> = this._summary.asObservable();

  private _store: State = {
    partidas: [],
  };
  private store = new BehaviorSubject<State>(this._store);

  constructor(private itemController: ItemController) {}

  setPedido(data: Partial<Pedido>) {
    this.form.patchValue(data);
  }

  recalcular() {
    const tipo = this.tipo;
    const cliente = this.cliente;
    const formaDePago = this.form.get('formaDePago').value;
    const descuentoEspecial = this.form.get('descuentoEspecial').value;

    const config = { tipo, formaDePago, cliente, descuentoEspecial };
    console.log('Recalcular: ', config);

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
    // this.form.markAsDirty();
  }

  setPartidas(value: Partial<PedidoDet>[]) {
    this._currentPartidas = value;
    this._partidas.next(this._currentPartidas);
  }

  async addItem() {
    const item = test.TEST_PARTIDAS[0];
    // const item = await this.itemController.addItem(this.tipo);
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

  setDescuentoEspecial(descuento: number) {
    this.form.get('descuentoEspecial').setValue(descuento);
    return this;
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
}
