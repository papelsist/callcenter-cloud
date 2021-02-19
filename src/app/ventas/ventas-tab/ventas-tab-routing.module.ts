import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VentasTabPage } from './ventas-tab.page';

const routes: Routes = [
  {
    path: '',
    component: VentasTabPage,
    children: [
      {
        path: 'cotizaciones',
        loadChildren: () =>
          import('../cotizaciones/cotizaciones.module').then(
            (m) => m.CotizacionesPageModule
          ),
      },
      {
        path: 'facturas',
        loadChildren: () =>
          import('../facturas/facturas.module').then(
            (m) => m.FacturasPageModule
          ),
      },
      {
        path: 'pendientes',
        loadChildren: () =>
          import('../pendientes/pendientes.module').then(
            (m) => m.PendientesPageModule
          ),
      },
      {
        path: '',
        redirectTo: '/ventas/cotizaciones',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'cotizaciones/create',
    loadChildren: () =>
      import('../pedido-create/pedido-create.module').then(
        (m) => m.PedidoCreatePageModule
      ),
  },
  {
    path: 'cotizaciones/:id',
    loadChildren: () =>
      import('../pedido-edit/pedido-edit.module').then(
        (m) => m.PedidoEditPageModule
      ),
  },
  {
    path: '',
    redirectTo: '/ventas/cotizaciones',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VentasTabPageRoutingModule {}