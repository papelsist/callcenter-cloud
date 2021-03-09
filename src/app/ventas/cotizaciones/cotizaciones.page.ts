import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Pedido, User } from '@papx/models';
import { PedidosFacade } from '../@data-access/+state';

import { VentasFacade } from '../@data-access/+state/ventas.facade';
import { VentasController } from '../shared/ventas.controller';
import { Cotizaciones, CotizacionesFacade } from './cotizaciones-facade';

@Component({
  selector: 'app-cotizaciones',
  templateUrl: './cotizaciones.page.html',
  styleUrls: ['./cotizaciones.page.scss'],
  providers: [CotizacionesFacade],
})
export class CotizacionesPage implements OnInit {
  state$ = this.facade.state$;

  constructor(
    private facade: CotizacionesFacade,
    private router: Router,
    private ventasController: VentasController,
    private pedidosFacade: PedidosFacade,
    private alert: AlertController
  ) {}

  ngOnInit() {}

  onFilter() {
    this.facade.toggleFilter();
  }

  onSelection(event: Partial<Pedido>) {
    this.router.navigate(['', 'ventas', 'cotizaciones', event.id]);
  }

  async onCopiar(event: Partial<Pedido>, user: User) {
    await this.ventasController.generarCopiaPedido(event, user);
  }

  async onCerrar(event: Partial<Pedido>, user: User) {
    const modal = await this.alert.create({
      header: 'Cerrar pedido: ' + event.folio + ' ?',
      subHeader: event.autorizacionesRequeridas
        ? 'Requiere autorización:'
        : event.nombre,
      message: event.autorizacionesRequeridas
        ? event.autorizacionesRequeridas
        : 'Para ser atendido en sucursal',
      animated: true,
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => ({ cerrar: false }),
        },
        {
          text: 'Aceptar',
          role: 'acept',
          handler: () => ({ cerrar: true }),
        },
      ],
    });
    await modal.present();
    const {
      data: { cerrar },
    } = await modal.onWillDismiss();
    console.log('DatA: ', cerrar);
    if (cerrar) {
      // console.log('Cerrar pedido: ', event);
      // console.log('Requiere autorizacion: ', event.warnings);
      this.pedidosFacade.cerrarPedido(event.id, event, user);
    }
  }

  enEsperaDeAutorizacion() {}

  getTitle(filtered: boolean) {
    return filtered ? 'Mis cotizaciones' : 'Cotizaciones';
  }
}
