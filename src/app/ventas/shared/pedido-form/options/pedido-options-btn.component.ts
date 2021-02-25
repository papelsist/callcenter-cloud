import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
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
  constructor(
    private popoverController: PopoverController,
    private facade: PcreateFacade
  ) {}

  ngOnInit() {}

  async showOptions(ev: any) {
    console.log('Facadde: ', this.facade);
    const popover = await this.popoverController.create({
      component: PedidoOptionsComponent,
      componentProps: { facade: this.facade },
      cssClass: 'pedido-form-options',
      event: ev,
      translucent: true,
    });
    return await popover.present();
  }
}
