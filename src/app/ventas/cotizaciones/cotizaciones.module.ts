import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CommonUiCoreModule } from '@papx/common/ui-core';
import { CommonUiForms } from '@papx/common/ui-forms';

import { CotizacionesPage } from './cotizaciones.page';
import { SharedVentasModule } from '../shared/shared-ventas.module';

import { SharedPedidosListModule } from '../shared/pedidos-list';
import { PedidosSearchModule } from '../shared/pedidos-search/pedidos-search.module';

const routes: Routes = [
  {
    path: '',
    component: CotizacionesPage,
  },
];

@NgModule({
  imports: [
    CommonUiCoreModule,
    CommonUiForms,
    SharedVentasModule,
    SharedPedidosListModule,
    PedidosSearchModule,
    RouterModule.forChild(routes),
  ],
  declarations: [CotizacionesPage],
})
export class CotizacionesPageModule {}
