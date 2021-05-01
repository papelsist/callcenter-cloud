import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CommonUiCoreModule } from '@papx/common/ui-core';
import { PedidosSearchModule } from '../shared/pedidos-search/pedidos-search.module';
import { SharedVentasModule } from '../shared/shared-ventas.module';
import { COMPONENTS } from './components';

import { FacturasPage } from './facturas.page';
const routes: Routes = [
  {
    path: '',
    component: FacturasPage,
  },
];

@NgModule({
  imports: [
    CommonUiCoreModule,
    SharedVentasModule,
    PedidosSearchModule,
    RouterModule.forChild(routes),
  ],
  declarations: [FacturasPage, ...COMPONENTS],
  exports: [...COMPONENTS],
})
export class FacturasPageModule {}
