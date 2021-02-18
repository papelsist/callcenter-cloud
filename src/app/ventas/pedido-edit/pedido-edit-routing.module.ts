import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PedidoEditPage } from './pedido-edit.page';

const routes: Routes = [
  {
    path: '',
    component: PedidoEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PedidoEditPageRoutingModule {}
