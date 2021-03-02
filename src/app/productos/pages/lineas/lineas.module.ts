import { NgModule } from '@angular/core';
import { CommonUiCoreModule } from '@papx/common/ui-core';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [
  {
    path: '',
    component: LineasPage,
  },
];

import { LineasPage } from './lineas.page';

@NgModule({
  imports: [CommonUiCoreModule, RouterModule.forChild(routes)],
  declarations: [LineasPage],
})
export class LineasPageModule {}
