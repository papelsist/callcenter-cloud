import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { AlertController, PopoverController } from '@ionic/angular';
import { TipoDePedido } from '@papx/models';
import { PcreateFacade } from '../create-form/pcreate.facade';

@Component({
  selector: 'papx-pedido-options-list',
  template: `
    <ion-list>
      <ion-list-header> Operaciones </ion-list-header>
      <ion-item
        button
        detail="false"
        (click)="setDescuentoEspecial()"
        *ngIf="!facade.isCredito()"
      >
        <ion-label color="warning">Descuento especial</ion-label>
        <ion-icon name="download" slot="end"></ion-icon>
      </ion-item>
      <ion-item button detail="false" (click)="toggleReorer()">
        <ion-label> Reordenamiento </ion-label>
        <ion-icon name="reorder-two" slot="end"></ion-icon>
      </ion-item>
      <ion-item lines="none" detail="false" button (click)="dismissPopover()"
        >Cerrar</ion-item
      >
    </ion-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PedidoOptionsComponent implements OnInit {
  @Input() facade: PcreateFacade;
  constructor(
    private popover: PopoverController,
    private alert: AlertController
  ) {}

  ngOnInit() {}

  async dismissPopover() {
    await this.popover.dismiss();
  }

  async toggleReorer() {
    this.facade.toggleReorer();
    await this.popover.dismiss();
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
          value: this.facade.descuentoEspecial,
        },
      ],
      buttons: [
        {
          text: 'Cerrar',
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
