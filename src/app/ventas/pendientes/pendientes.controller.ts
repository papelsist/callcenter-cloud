import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { Pedido } from '@papx/models';

@Injectable()
export class PendientesController {
  constructor(
    private alert: AlertController,
    private loading: LoadingController
  ) {}

  async starLoading() {
    const l = await this.loading.create({
      message: 'Procesando',
      mode: 'ios',
      spinner: 'circles',
      translucent: true,
      backdropDismiss: false,
    });
    await l.present();
  }
  async stopLoading() {
    await this.loading.dismiss();
  }

  async regresar(pedido: Pedido) {
    const alert = await this.alert.create({
      header: 'Pedido: ' + pedido.folio,
      subHeader: 'De: ' + pedido.nombre,
      message: 'Regresar pedido?',
      animated: true,
      cssClass: 'regreso-de-pedido-alert',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => ({ regresar: false }),
        },
        {
          text: 'Aceptar',
          role: 'accept',
          handler: () => ({ regresar: true }),
        },
      ],
    });
    await alert.present();
    const {
      data: { regresar },
    } = await alert.onDidDismiss();

    return !!regresar;
  }

  async autorizar(pedido: Pedido) {
    const inputs = pedido.warnings.map((it) => ({
      disabled: true,
      value: it.descripcion,
    }));
    const alert = await this.alert.create({
      header: 'Autorizar pedido: ' + pedido.folio,
      subHeader: pedido.nombre,
      message: `Total: ${pedido.total} (Vend: ${pedido.updateUser})`,
      animated: true,
      cssClass: 'autorizacion-de-pedido-alert',
      inputs: [
        ...inputs,
        {
          type: 'text',
          placeholder: 'Comentario',
          name: 'comentario',
          handler: (value) => ({ comentario: value }),
        },
      ],
      //inputs: [pedido.warnings.map( w => ({}))],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => ({ autorizar: false }),
        },
        {
          text: 'Aceptar',
          role: 'accept',
          handler: () => ({ autorizar: true }),
        },
      ],
    });
    await alert.present();
    const {
      data: {
        autorizar,
        values: { comentario },
      },
    } = await alert.onDidDismiss();
    return { autorizar, comentario };
  }

  async handelError(error: any) {
    const al = await this.alert.create({
      header: 'Error salvando datos',
      message: error.message || 'Sin información',
      cssClass: 'pendientes-error-handler-alert',
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
