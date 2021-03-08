import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Pedido, User } from '@papx/models';

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
    private ventasController: VentasController
  ) {}

  ngOnInit() {
    this.state$.subscribe((r) => console.log('State: ', r));
  }

  onFilter() {
    this.facade.toggleFilter();
  }

  onSelection(event: Partial<Pedido>) {
    // console.log('Drill: ', event);
    this.router.navigate(['', 'ventas', 'cotizaciones', event.id]);
  }

  async onCopiar(event: Partial<Pedido>, user: User) {
    await this.ventasController.generarCopiaPedido(event, user);
  }
}
