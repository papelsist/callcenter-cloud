import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Pedido } from '@papx/models';

import { VentasFacade } from '../@data-access/+state/ventas.facade';
import { Cotizaciones, CotizacionesFacade } from './cotizaciones-facade';

@Component({
  selector: 'app-cotizaciones',
  templateUrl: './cotizaciones.page.html',
  styleUrls: ['./cotizaciones.page.scss'],
  providers: [CotizacionesFacade],
})
export class CotizacionesPage implements OnInit {
  state$ = this.facade.state$;
  constructor(private facade: CotizacionesFacade, private router: Router) {}

  ngOnInit() {}

  onFilter() {
    this.facade.toggleFilter();
  }

  onSelection(event: Partial<Pedido>) {
    // console.log('Drill: ', event);
    this.router.navigate(['', 'ventas', 'cotizaciones', event.id]);
  }
}
