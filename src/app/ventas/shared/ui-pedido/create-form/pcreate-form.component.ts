import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';

import { AlertController } from '@ionic/angular';

import { takeUntil, tap } from 'rxjs/operators';
import { merge } from 'rxjs';

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
  summary$ = this.facade.summary$;

  constructor(private facade: PcreateFacade, private alert: AlertController) {
    super();
  }

  ngOnInit() {
    this.facade.setPedido(this.data);

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
