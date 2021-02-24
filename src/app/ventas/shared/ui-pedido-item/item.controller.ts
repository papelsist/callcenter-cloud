import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PedidoDet, TipoDePedido } from '@papx/models';
import { ItemModalComponent } from './item-modal/item-modal.component';

@Injectable()
export class ItemController {
  constructor(private modalController: ModalController) {}

  async addItem(
    tipo: TipoDePedido,
    sucursal?: string
  ): Promise<Partial<PedidoDet> | null> {
    const modal = await this.modalController.create({
      component: ItemModalComponent,
      componentProps: {
        tipo,
        sucursal,
      },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss<Partial<PedidoDet>>();
    return data;
  }

  async editItem(
    item: Partial<PedidoDet>,
    tipo: TipoDePedido,
    sucursal?: string
  ): Promise<Partial<PedidoDet> | null> {
    console.log('Editando: ', item);
    const modal = await this.modalController.create({
      component: ItemModalComponent,
      componentProps: {
        tipo,
        sucursal,
        item,
      },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss<Partial<PedidoDet>>();
    if (data) {
      return { ...item, ...data };
    } else {
      return null;
    }
  }
}
