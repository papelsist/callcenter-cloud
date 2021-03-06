import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  PopoverController,
} from '@ionic/angular';
import { TipoDePedido } from '@papx/models';

import { PcreateFacade } from '../create-form/pcreate.facade';
import { PedidoOptionsComponent } from './pedido-options.component';

@Component({
  selector: 'papx-pedido-options-button',
  template: `
    <ion-button (click)="showOptions($event)">
      <ion-icon
        name="ellipsis-vertical"
        slot="icon-only"
        ios="ellipsis-horizontal"
        md="ellipsis-vertical"
      ></ion-icon>
    </ion-button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PedidoOptionsButtonComponent implements OnInit {
  @Output() cerrar = new EventEmitter();

  constructor(
    private popoverController: PopoverController,
    private facade: PcreateFacade,
    private actionSheet: ActionSheetController,
    private alert: AlertController
  ) {}

  ngOnInit() {}

  async showOptions(ev: any) {
    const action = await this.actionSheet.create({
      header: 'Operaciones con el pedido ..',
      animated: true,
      translucent: true,
      buttons: [
        ...this.buildOptionButtons(),
        {
          text: 'Cancelar',
          role: 'cancel',
        },
      ],
    });
    await action.present();
  }

  private buildOptionButtons() {
    if (this.facade.getPedido()) {
      return this.editOptions();
    } else return this.createOptions();
  }
  private createOptions() {
    return [
      {
        text: 'Cliente nuevo',
        role: 'selected',
        icon: 'person-add',
        handler: () => this.facade.registrarClienteNuevo(),
      },
      {
        text: 'Descuento especial',
        role: 'selected',
        icon: 'archive',
        handler: () => this.setDescuentoEspecial(),
      },
    ];
  }

  private editOptions() {
    return [
      {
        text: 'Cliente nuevo',
        role: 'selected',
        icon: 'person-add',
        handler: () => this.facade.registrarClienteNuevo(),
      },
      {
        text: 'Descuento especial',
        role: 'selected',
        icon: 'archive',
        handler: () => this.setDescuentoEspecial(),
      },
      {
        text: 'Cerrar pedido',
        role: 'selected',
        icon: 'checkmark-done',
        handler: () => this.cerrar.emit(),
      },
      {
        text: 'Eliminar pedido',
        role: 'destructive',
        icon: 'trash',
        handler: () => console.log('Eliminar'),
      },
    ];
  }

  /**
   * TODO Mover a componente
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
