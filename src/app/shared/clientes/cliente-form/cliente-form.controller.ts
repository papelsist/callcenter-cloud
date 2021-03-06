import { Injectable } from '@angular/core';
import {
  AlertController,
  LoadingController,
  ModalController,
} from '@ionic/angular';

import { User } from '@papx/models';
import { ClientesDataService } from '@papx/shared/clientes/@data-access/clientes-data.service';

import { ClienteFormComponent } from './cliente-form.component';

/**
 * Not working BUG!!!!
 */
@Injectable()
export class ClienteFormController {
  constructor(
    private alert: AlertController,
    private loading: LoadingController,
    private modalController: ModalController,
    private service: ClientesDataService
  ) {}

  private async starLoading(message = 'Procesando') {
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

  private async stopLoading() {
    await this.loading.dismiss(null, null, 'cliente-loading');
  }

  async clienteNuevo(user: User) {
    // console.log('Registrando ciente nuevo: ', user);
    const modal = await this.modalController.create({
      component: ClienteFormComponent,
      componentProps: {},
      cssClass: 'cliente-form-modal',
      animated: true,
      mode: 'ios',
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) {
      try {
        await this.starLoading('Salvando cliente');
        const id = await this.service.saveCliente(data, user);
        await this.stopLoading();
        console.log('Cliente generado : ', id);
        return id;
      } catch (error) {
        await this.stopLoading();
        this.handelError(error);
      }
    } else {
      return null;
    }
  }

  private async handelError(error: any) {
    const al = await this.alert.create({
      header: 'Error al salvar cliente',
      message: error.message || 'Sin información',
      cssClass: 'cliene-controller-alert',
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
