import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommonUiCoreModule } from '@papx/common/ui-core';
import { SharedPedidoFormModule } from '../shared/pedido-form';
import { SharedVentasModule } from '../shared/shared-ventas.module';
import { SharedUiPedidoItemModule } from '../shared/ui-pedido-item';

import { PedidoEditPage } from './pedido-edit.page';
import { PedidoExistsGuard } from '../@data-access/guards/pedido.exists.guard';

const routes: Routes = [
  {
    path: '',
    component: PedidoEditPage,
    canActivate: [PedidoExistsGuard],
    // resolve: { current: PedidoResolver },
  },
];

@NgModule({
  imports: [
    CommonUiCoreModule,
    SharedPedidoFormModule,
    SharedUiPedidoItemModule,
    SharedVentasModule,
    RouterModule.forChild(routes),
  ],
  declarations: [PedidoEditPage],
})
export class PedidoEditPageModule {}
