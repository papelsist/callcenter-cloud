import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransportesPage } from './transportes.page';

const routes: Routes = [
  {
    path: '',
    component: TransportesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransportesPageRoutingModule {}
