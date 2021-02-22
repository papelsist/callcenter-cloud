import { Injectable } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { ClienteDireccion, Direccion } from '@papx/models';
import { DireccionEditComponent } from './direccion-edit.component';

@Injectable({ providedIn: 'any' })
export class DireccionController {
  constructor(
    private modalController: ModalController,
    private actionSheetCtrl: ActionSheetController
  ) {}

  async addDireccion() {
    const modal = await this.modalController.create({
      component: DireccionEditComponent,
      componentProps: { direccion: null, title: 'Nueva dirección' },
    });
    modal.present();
    const { data } = await modal.onWillDismiss();
    return data;
  }

  async editDireccion(direccion: Direccion) {
    const modal = await this.modalController.create({
      component: DireccionEditComponent,
      componentProps: { direccion },
    });
    modal.present();
    const { data } = await modal.onWillDismiss();
    return data;
  }
}
