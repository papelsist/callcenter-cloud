import { NgModule } from '@angular/core';
import { CommonUiCoreModule } from '@papx/common/ui-core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: BuscarPage,
  },
];

import { BuscarPage } from './buscar.page';

@NgModule({
  imports: [CommonUiCoreModule, RouterModule.forChild(routes)],
  declarations: [BuscarPage],
})
export class BuscarPageModule {}
