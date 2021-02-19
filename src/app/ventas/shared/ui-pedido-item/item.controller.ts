import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PedidoDet } from '@papx/models';
import { ItemModalComponent } from './item-modal/item-modal.component';

@Injectable()
export class ItemController {
  constructor(private modalController: ModalController) {}

  async addItem(): Promise<Partial<PedidoDet> | null> {
    console.log('Agregando Pedido item');
    const modal = await this.modalController.create({
      component: ItemModalComponent,
      componentProps: {},
    });
    await modal.present();
    const { data } = await modal.onWillDismiss<Partial<PedidoDet>>();
    return data;
  }
}
