import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Producto } from '@papx/models';
import { map, take, tap } from 'rxjs/operators';
import { ProductoService } from '../data-access';
import { ProductoSelectorComponent } from './producto-selector.component';

@Injectable()
export class ProductoController {
  constructor(
    private modalController: ModalController,
    private service: ProductoService
  ) {}

  async findProducto(element?: any) {
    const nativeEl = await this.modalController.getTop();
    const modal = await this.modalController.create({
      component: ProductoSelectorComponent,
      componentProps: {
        productos$: this.service.activos$,
        tipo: 'CREDITO',
      },
      swipeToClose: true,
      presentingElement: element ?? nativeEl,
    });
    await modal.present();
    const { data } = await modal.onWillDismiss<Partial<Producto>>();
    return data;
  }

  findByClave(clave: string) {
    return this.service.productosMap$.pipe(
      map((map) => map[clave.toUpperCase()]),
      take(1)
    );
  }

  findById(id: string) {
    return this.service.productos$.pipe(
      map((prods) => prods.filter((item) => item.id === id), take(1))
    );
  }
}
