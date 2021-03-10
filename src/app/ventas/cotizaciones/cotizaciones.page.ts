import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '@papx/auth';
import { BaseComponent } from '@papx/core';
import { Pedido, User } from '@papx/models';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { map, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { VentasDataService } from '../@data-access';
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
export class CotizacionesPage extends BaseComponent implements OnInit {
  filtrarPorUsuario$ = new BehaviorSubject<boolean>(true);
  user$ = this.auth;

  vm$ = combineLatest([this.filtrarPorUsuario$, this.auth.user$]).pipe(
    map(([filtrar, user]) => ({ filtrar, user }))
  );

  cotizaciones$ = this.vm$.pipe(
    switchMap((vm) =>
      vm.filtrar
        ? this.dataService.fetchCotizaciones(vm.user)
        : this.dataService.cotizaciones$
    )
  );
  constructor(
    private facade: CotizacionesFacade,
    private router: Router,
    private ventasController: VentasController,
    private pedidosFacade: PedidosFacade,
    private alert: AlertController,
    private auth: AuthService,
    private dataService: VentasDataService
  ) {
    super();
  }

  ngOnInit() {}

  onFilter(val: boolean) {
    this.filtrarPorUsuario$.next(!val);
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
    if (cerrar) {
      this.pedidosFacade.cerrarPedido(event.id, event, user);
    }
  }

  getTitle(filtered: boolean) {
    return filtered ? 'Mis cotizaciones' : 'Cotizaciones';
  }
}
