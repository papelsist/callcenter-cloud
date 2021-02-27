import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { Pedido, User } from '@papx/models';
import { VentasDataService } from '../@data-access';

import { copiarPedido } from '../utils';

@Injectable({ providedIn: 'root' })
export class VentasController {
  constructor(
    private ventasDataService: VentasDataService,
    private alert: AlertController,
    private loading: LoadingController
  ) {}

  async starLoading(message = 'Procesando') {
    const l = await this.loading.create({
      message,
      mode: 'ios',
      spinner: 'circles',
      translucent: true,
      backdropDismiss: false,
      id: 'ventas-loading',
    });
    await l.present();
  }

  async stopLoading() {
    await this.loading.dismiss(null, null, 'ventas-loading');
  }

  /**
   * Generar un nuevo pedido a partir
   * @param pedido
   */
  async generarCopiaPedido(pedido: Pedido, user: User) {
    const alert = await this.alert.create({
      header: 'Generar cotización ',
      subHeader: 'A partir del pedido: ' + pedido.folio,
      message: pedido.nombre,
      animated: true,
      mode: 'ios',
      cssClass: 'copia-de-pedido-alert',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => ({ copiar: false }),
        },
        {
          text: 'Aceptar',
          role: 'accept',
          handler: () => ({ copiar: true }),
        },
      ],
    });
    await alert.present();
    const {
      data: { copiar },
    } = await alert.onDidDismiss();
    if (!!copiar) {
      console.log('user: ', user);
      await this.starLoading('Generando copia, ');
      const clone = copiarPedido(pedido);
      // Pendiente actualizar precios
      try {
        const res = await this.ventasDataService.createPedido(clone, user);
        console.log('Pedido generado: ', res);
        await this.stopLoading();
      } catch (error) {
        await this.stopLoading();
        await this.handelError(error);
      }
    }
  }

  async handelError(error: any) {
    const al = await this.alert.create({
      header: 'Error al salvar pedido',
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
