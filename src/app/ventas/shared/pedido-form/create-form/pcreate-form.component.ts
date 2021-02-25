import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';

import { AlertController } from '@ionic/angular';

import {
  startWith,
  takeUntil,
  tap,
  map,
  distinctUntilChanged,
} from 'rxjs/operators';
import { merge, Observable } from 'rxjs';

import { BaseComponent } from '@papx/core';
import { Cliente, Pedido, TipoDePedido } from '@papx/models';
import { PcreateFacade } from './pcreate.facade';

@Component({
  selector: 'papx-pedido-form',
  templateUrl: './pcreate-form.component.html',
  styleUrls: ['./pcreate-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PcreateFacade],
})
export class PedidoCreateFormComponent extends BaseComponent implements OnInit {
  @Output() save = new EventEmitter<Partial<Pedido>>();
  @Input() data: Partial<Pedido> = {};
  @Output() errors = new EventEmitter();

  form = this.facade.form;
  partidas$ = this.facade.partidas$;
  cortes$ = this.facade.cortes$;
  summary$ = this.facade.summary$;
  cliente$: Observable<any>;
  segment = 'partidas';
  hasErrors$ = this.facade.errors$.pipe(map((errors) => errors.length > 0));

  constructor(private facade: PcreateFacade, private alert: AlertController) {
    super();
  }

  ngOnInit() {
    this.facade.setPedido(this.data);
    this.addListeners();
    this.facade.actualizarProductos();
  }

  actualizar() {
    this.facade.actualizarProductos();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.facade.closeLiveSubscriptions();
  }

  addListeners() {
    this.cliente$ = this.controls.cliente.valueChanges.pipe(
      startWith(this.cliente) /**Important!  Needs to start with*/
    );
    this.recalculoListener();
    this.sucursalListener();
    this.errorsListener();
    this.clienteListener();
  }

  recalculoListener() {
    merge(
      this.facade.controls.tipo.valueChanges.pipe(
        tap((tipo) => {
          // Side effect para limpiar el descuento especial
          if (tipo === TipoDePedido.CREDITO && this.facade.descuentoEspecial) {
            this.facade.setDescuentoEspecial(0.0, true); // Sin detonar eventos
          }
        })
      ),
      this.facade.controls.formaDePago.valueChanges
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.facade.recalcular());
  }

  errorsListener() {
    this.facade.errors$
      .pipe(takeUntil(this.destroy$))
      .subscribe((errors) => this.errors.emit(errors));
  }

  private sucursalListener() {
    this.form
      .get('sucursalEntity')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((s) => {
        if (s) {
          this.form.get('sucursal').setValue(s.nombre);
          this.form.get('sucursalId').setValue(s.id);
        }
      });
  }

  private clienteListener() {
    this.controls.cliente.valueChanges.pipe(
      takeUntil(this.destroy$),
      distinctUntilChanged(),
      tap((cte) => this.ajustarTipo(cte))
    );
  }

  get canSubmit() {
    return this.form.valid && this.form.dirty;
  }

  submit() {
    if (this.canSubmit) {
      const data = this.facade.resolvePedidoData();
      this.facade.closeLiveSubscriptions();
      this.save.emit(data);
    }
  }

  get controls() {
    return this.facade.controls;
  }

  async addItem() {
    await this.facade.addItem();
  }

  get cliente() {
    return this.form.get('cliente').value;
  }

  async onChangeCliente() {
    await this.facade.cambiarCliente();
  }

  segmentChanged({ detail: { value } }: any) {
    this.segment = value;
    // this.cd.markForCheck();
  }

  ajustarTipo(cliente: Partial<Cliente>) {
    // Side effect to update other controls
    if (this.form.get('total').value > 0) return;
    if (cliente.credito) {
      if (this.facade.tipo !== TipoDePedido.CREDITO) {
        this.controls.tipo.setValue(TipoDePedido.CREDITO, {
          emitEvent: false,
          onlySelf: true,
        });
      }
    } else {
      if (this.facade.tipo === TipoDePedido.CREDITO) {
        this.controls.tipo.setValue(TipoDePedido.CONTADO, {
          emitEvent: false,
          onlySelf: true,
        });
      }
    }
  }

  /**
   * TODO Mover a componente de opciones o al facade
   */
  async setDescuentoEspecial() {
    if (this.facade.tipo === TipoDePedido.CREDITO) return; // No procede
    const alert = await this.alert.create({
      header: 'Descuento especial',
      message: 'Registre el descuento',
      inputs: [
        {
          type: 'number',
          placeholder: 'Descuento',
          tabindex: 99,
          name: 'descuento',
          max: 40,
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Aceptar',
          role: '',

          handler: (value: any) => {
            this.facade.setDescuentoEspecial(value.descuento).recalcular();
          },
        },
      ],
    });
    await alert.present();
  }
}
