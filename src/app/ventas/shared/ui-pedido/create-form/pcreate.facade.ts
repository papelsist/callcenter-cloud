import { Injectable } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { BehaviorSubject, Observable } from 'rxjs';

import {
  Cliente,
  Pedido,
  PedidoDet,
  PedidoSummary,
  TipoDePedido,
} from '@papx/models';
import { recalcularPartidas, buildSummary } from '../../../utils';
import { ItemController } from '../../ui-pedido-item';

import * as test from './test.data';
import { ClienteSelectorController } from '@papx/shared/clientes/cliente-selector';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { createEnvioForm } from './pedido-form-factory';
import { PedidoForm } from '../pedido-form';
import { getFormValidationErrors } from '@papx/utils';

interface State {
  partidas: Partial<PedidoDet>[];
}

@Injectable()
export class PcreateFacade {
  readonly form = new PedidoForm(this.fb);
  /*
  readonly form: FormGroup = new FormGroup({
    cliente: new FormControl(null, Validators.required),
    sucursal: new FormControl(null, Validators.required),
    formaDePago: new FormControl(null, Validators.required),
    tipo: new FormControl(null, Validators.required),
    moneda: new FormControl(
      { value: 'MXN', disabled: true },
      Validators.required
    ),
    comprador: new FormControl(null, Validators.maxLength(50)),
    comentario: new FormControl(null, Validators.maxLength(250)),
    descuentoEspecial: new FormControl(null),
    usoDeCfdi: new FormControl('G01', Validators.required),
    cfdiMail: new FormControl(null, Validators.email),
    envio: createEnvioForm(this.fb),
    corteImporte: new FormControl(null),
  });
  */

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

  private _store: State = {
    partidas: [],
  };
  private store = new BehaviorSubject<State>(this._store);

  errors$ = this.form.statusChanges.pipe(
    //startWith('VALID'),
    map(() => {
      if (this.form.pristine) return [];
      let errors = getFormValidationErrors(this.form);
      if (this.form.get('envio').enabled) {
        const envio = this.form.get('envio') as FormGroup;
        errors = [...errors, ...getFormValidationErrors(envio)];
      }
      return errors;
    })
  );
  constructor(
    private itemController: ItemController,
    private clienteController: ClienteSelectorController,
    private fb: FormBuilder
  ) {}

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
    this.form.get('total').setValue(summary.total);
    // this.form.markAsDirty();
  }

  setPartidas(value: Partial<PedidoDet>[]) {
    this._currentPartidas = value;
    this._partidas.next(this._currentPartidas);
  }

  async addItem() {
    const item = await this.itemController.addItem(this.tipo);
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
    this.form.get('cfdiMail').setValue(cliente.cfdiMail);
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

  isCredito() {
    return this.tipo === TipoDePedido.CREDITO;
  }
}
