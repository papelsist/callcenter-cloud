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
        data: { cantidad: 0 },
      },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss<Partial<PedidoDet>>();
    return data;
  }
}
