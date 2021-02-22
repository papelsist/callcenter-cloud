import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';

import { AlertController } from '@ionic/angular';

import { startWith, takeUntil, tap } from 'rxjs/operators';
import { merge, Observable } from 'rxjs';

import { BaseComponent } from '@papx/core';
import { PedidoCreateDto, TipoDePedido } from '@papx/models';
import { PcreateFacade } from './pcreate.facade';

@Component({
  selector: 'papx-pedido-create-form',
  templateUrl: './pcreate-form.component.html',
  styleUrls: ['./pcreate-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PcreateFacade],
})
export class PedidoCreateFormComponent extends BaseComponent implements OnInit {
  @Output() save = new EventEmitter<PedidoCreateDto>();
  @Input() data: Partial<PedidoCreateDto> = {};

  form = this.facade.form;
  partidas$ = this.facade.partidas$;
  cortes$ = this.facade.cortes$;
  summary$ = this.facade.summary$;
  cliente$: Observable<any>;
  segment = 'partidas';

  constructor(private facade: PcreateFacade, private alert: AlertController) {
    super();
  }

  ngOnInit() {
    this.facade.setPedido(this.data);

    this.cliente$ = this.controls.cliente.valueChanges.pipe(
      startWith(this.cliente) /**Important!  Needs to start with*/
    );

    merge(
      this.facade.controls.tipo.valueChanges.pipe(
        tap((tipo) => {
          if (tipo === TipoDePedido.CREDITO && this.facade.descuentoEspecial) {
            this.facade.setDescuentoEspecial(0.0);
          }
        })
      ),
      this.facade.controls.formaDePago.valueChanges
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.facade.recalcular());
  }

  get canSubmit() {
    return this.form.valid;
  }

  submit() {
    if (this.canSubmit) {
      const data = this.form.value;
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
