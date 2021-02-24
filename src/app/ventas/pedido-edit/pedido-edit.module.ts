import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommonUiCoreModule } from '@papx/common/ui-core';
import { SharedPedidoFormModule } from '../shared/pedido-form';
import { SharedUiPedidoItemModule } from '../shared/ui-pedido-item';

import { PedidoEditPage } from './pedido-edit.page';
import { PedidoExistsGuard } from './pedido.exists.guard';

const routes: Routes = [
  {
    path: '',
    component: PedidoEditPage,
    canActivate: [PedidoExistsGuard],
  },
];

@NgModule({
  imports: [
    CommonUiCoreModule,
    SharedPedidoFormModule,
    SharedUiPedidoItemModule,
    RouterModule.forChild(routes),
  ],
  declarations: [PedidoEditPage],
})
export class PedidoEditPageModule {}
