import { Injectable } from '@angular/core';
import {
  AlertController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import {
  buildDireccionKey,
  Cliente,
  ClienteDireccion,
  Direccion,
  User,
} from '@papx/models';
import { ClientesDataService } from '@papx/shared/clientes/@data-access/clientes-data.service';
import { DireccionEditComponent } from './direccion-edit.component';
import { DireccionEntregaComponent } from './direccion-entrega/direccion-entrega.component';

@Injectable({ providedIn: 'any' })
export class DireccionController {
  constructor(
    private modalController: ModalController,
    private loading: LoadingController,
    private clienteDataService: ClientesDataService,
    private alert: AlertController
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

  async addDireccionEntrega(cte: Cliente, user: User) {
    const modal = await this.modalController.create({
      component: DireccionEntregaComponent,
      componentProps: {},
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      await this.startLoading('Agregando dirección de entrega');
      const cd: ClienteDireccion = {
        ...data,
        nombre: buildDireccionKey(data.direccion),
      };

      const direcciones = [...(cte.direcciones ?? []), cd];
      const payload = {
        direcciones,
        updateLog: 'NUEVA DIRECCION DE ENTREGA',
      };
      try {
        await this.clienteDataService.updateCliente(cte.id, payload, user);
        await this.stopLoading();
      } catch (error) {
        this.stopLoading();
        this.handelError(error);
        console.error('Error agregando direccion: ', error.message);
      }
    }
  }

  async editDireccionEntrega(
    cte: Cliente,
    cteDir: ClienteDireccion,
    user: User
  ) {
    const modal = await this.modalController.create({
      component: DireccionEntregaComponent,
      componentProps: { direccionEntrega: cteDir },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data) {
      const target = { ...data, nombre: buildDireccionKey(data.direccion) };

      const otras = cte.direcciones.filter(
        (item) => item.nombre !== cteDir.nombre
      );

      const direcciones = [...otras, target];
      const payload = {
        direcciones,
        updateLog: 'DIRECCION DE ENGREGA MODIFICADA',
      };
      try {
        await this.clienteDataService.updateCliente(cte.id, payload, user);
      } catch (error) {
        console.error('Error agregando direccion: ', error.message);
      }
    }
  }

  async deleteDireccion(cte: Cliente, cteDir: ClienteDireccion, user: User) {
    const modal = await this.alert.create({
      header: 'Eliminar dirección',
      message: cteDir.nombre,
      id: 'eliminar-direccion-alert',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Aceptar',
          role: 'acept',
          handler: () => ({ eliminar: true }),
        },
      ],
    });
    await modal.present();
    const {
      data: { eliminar },
    } = await modal.onWillDismiss();
    if (eliminar) {
      this.startLoading();
      setTimeout(async () => {
        try {
          const direcciones = cte.direcciones.filter(
            (item) => item.nombre !== cteDir.nombre
          );
          const data = {
            direcciones,
            updateLog: 'DIRECCION DE ENGREGA ELIMINADA',
          };
          await this.clienteDataService.updateCliente(cte.id, data, user);
          this.stopLoading();
        } catch (error) {
          this.stopLoading();
          console.error('Error agregando direccion: ', error.message);
          this.handelError(error);
        }
      }, 1000);
    }
  }

  async startLoading(message = 'Procesando') {
    const l = await this.loading.create({
      message,
      mode: 'ios',
      spinner: 'circles',
      translucent: true,
      backdropDismiss: false,
      id: 'clientes-loading',
    });
    await l.present();
  }

  async stopLoading() {
    await this.loading.dismiss(null, null, 'clientes-loading');
  }

  async handelError(error: any) {
    const al = await this.alert.create({
      id: 'direccion-alert-error',
      header: 'Error al actualizar información',
      message: error.message || 'Sin información',
      mode: 'ios',
      translucent: true,
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel',
        },
      ],
    });
    await al.present();
  }
}
