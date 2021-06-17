import { Injectable } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Pedido } from '@papx/models';
import { SolicitudesService } from '@papx/shared/solicitudes/@data-access/solicitudes.service';
import { take } from 'rxjs/operators';
import { CerrarPedidoComponent } from './cerrar-pedido.component';

@Injectable({ providedIn: 'root' })
export class CerrarPedidoController {
  constructor(
    private popoverController: PopoverController,
    private solicitudes: SolicitudesService
  ) {}

  async cerrar(pedido: Partial<Pedido>) {
    let solicitud = null;
    if (pedido.solicitud) {
      solicitud = await this.solicitudes
        .get(pedido.solicitud.id)
        .pipe(take(1))
        .toPromise();
    }
    const popover = await this.popoverController.create({
      component: CerrarPedidoComponent,
      componentProps: {
        pedido,
        solicitud,
      },
      animated: true,
      cssClass: 'pedido-popover-modal',
    });
    await popover.present();
    const { data } = await popover.onWillDismiss();
    return data;
  }
}
