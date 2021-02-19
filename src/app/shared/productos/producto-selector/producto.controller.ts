import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Producto } from '@papx/models';
import { ProductoSelectorComponent } from './producto-selector.component';

@Injectable()
export class ProductoController {
  constructor(private modalController: ModalController) {}

  async findProducto(element?: any) {
    const nativeEl = await this.modalController.getTop();
    const modal = await this.modalController.create({
      component: ProductoSelectorComponent,
      swipeToClose: true,
      presentingElement: element ?? nativeEl,
    });
    await modal.present();
    const { data } = await modal.onWillDismiss<Partial<Producto>>();
    return data;
  }
}
