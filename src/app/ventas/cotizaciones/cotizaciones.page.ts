import { Component, OnInit } from '@angular/core';

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
  constructor(private facade: CotizacionesFacade) {}

  ngOnInit() {}

  onFilter() {
    this.facade.toggleFilter();
  }
}
