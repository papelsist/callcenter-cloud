import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PedidoDet, TipoDePedido } from '@papx/models';
import { ExistenciasService } from '@papx/shared/productos/data-access/services/existencias.service';
import { ItemModalComponent } from './item-modal/item-modal.component';

@Injectable()
export class ItemController {
  constructor(
    private modalController: ModalController,
    private dataService: ExistenciasService
  ) {}

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
      cssClass: 'pedido-item-modal',
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
    // if (!item.producto.existencia) {
    //   const { id } = item.producto;
    //   const exis = await this.dataService.fetchExistencia(id);
    //   item.producto.existencia = exis;
    // }
    const { id } = item.producto;
    const exis = await this.dataService.fetchExistencia(id);
    item.producto.existencia = exis;
    const modal = await this.modalController.create({
      component: ItemModalComponent,
      cssClass: 'pedido-item-modal',
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
