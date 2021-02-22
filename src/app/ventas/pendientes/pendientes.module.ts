import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PendientesPage } from './pendientes.page';
import { CommonUiCoreModule } from '@papx/common/ui-core';
import { SharedVentasModule } from '../shared/shared-ventas.module';

const routes: Routes = [
  {
    path: '',
    component: PendientesPage,
  },
];

@NgModule({
  imports: [
    CommonUiCoreModule,
    SharedVentasModule,
    RouterModule.forChild(routes),
  ],
  declarations: [PendientesPage],
})
export class PendientesPageModule {}
