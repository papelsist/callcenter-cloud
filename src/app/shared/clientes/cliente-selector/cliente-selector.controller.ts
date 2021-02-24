import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Cliente } from '@papx/models';
import { ClienteSelectorComponent } from './cliente-selector.component';

@Injectable()
export class ClienteSelectorController {
  constructor(private modalController: ModalController) {}

  async selectCliente(props?: {}) {
    console.log('Lookup cliente: ', props);
    const modal = await this.modalController.create({
      component: ClienteSelectorComponent,
      componentProps: props,
      animated: true,
      cssClass: 'cliente-selector-modal',
      id: 'cliente-selector-modal',
    });
    await modal.present();
    const { data } = await modal.onWillDismiss<Cliente>();
    return data;
  }
}
