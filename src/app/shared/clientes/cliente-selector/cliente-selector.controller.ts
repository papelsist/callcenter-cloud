import { Injectable } from '@angular/core';
import {
  AlertController,
  LoadingController,
  ModalController,
} from '@ionic/angular';

import { Cliente } from '@papx/models';

import { ClienteSelectorComponent } from './cliente-selector.component';

@Injectable()
export class ClienteSelectorController {
  constructor(
    private modalController: ModalController,
    private loading: LoadingController,
    private alert: AlertController
  ) {}

  async selectCliente(props?: {}) {
    const modal = await this.modalController.create({
      component: ClienteSelectorComponent,
      componentProps: props,
      animated: true,
      cssClass: 'cliente-selector-modal',
      id: 'cliente-selector-modal',
    });
    await modal.present();
    const { data } = await modal.onWillDismiss<
      Cliente | 'CLIENTE_NUEVO' | undefined
    >();
    return data;
  }

  async clienteNuevo() {
    // const modal = await this.modalController.create({
    //   component: ClienteFormComponent,
    //   componentProps: {},
    //   cssClass: 'cliente-form-modal',
    //   animated: true,
    //   mode: 'ios',
    // });
    // await modal.present();
    // const { data } = await modal.onDidDismiss();
    // if (data) {
    //   try {
    //     await this.starLoading();
    //     const cteNvo = await this.service.saveCliente(data, this.user);
    //     await this.stopLoading();
    //     console.log('Cliente generado id: ', cteNvo);
    //     return cteNvo;
    //   } catch (error) {
    //     await this.stopLoading();
    //     this.handelError(error);
    //     return null;
    //   }
    // }
  }

  async starLoading(message = 'Procesando') {
    const l = await this.loading.create({
      message,
      mode: 'ios',
      spinner: 'circles',
      translucent: true,
      backdropDismiss: false,
      id: 'cliente-loading',
    });
    await l.present();
  }

  async stopLoading() {
    await this.loading.dismiss(null, null, 'cliente-loading');
  }

  async handelError(error: any) {
    const al = await this.alert.create({
      header: 'Error al salvar cliente',
      message: error.message || 'Sin información',
      cssClass: 'cliene-persist-alert',
      mode: 'ios',
      translucent: true,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
      ],
    });
    await al.present();
  }
}
