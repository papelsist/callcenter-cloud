import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CartItemPage } from './cart-item.page';

const routes: Routes = [
  {
    path: '',
    component: CartItemPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CartItemPageRoutingModule {}
