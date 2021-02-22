import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CommonUiCoreModule } from '@papx/common/ui-core';
import { SharedVentasModule } from '../shared/shared-ventas.module';

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
    RouterModule.forChild(routes),
  ],
  declarations: [FacturasPage],
})
export class FacturasPageModule {}
