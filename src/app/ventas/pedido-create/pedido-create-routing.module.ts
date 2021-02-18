import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PedidoCreatePage } from './pedido-create.page';

const routes: Routes = [
  {
    path: '',
    component: PedidoCreatePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PedidoCreatePageRoutingModule {}
