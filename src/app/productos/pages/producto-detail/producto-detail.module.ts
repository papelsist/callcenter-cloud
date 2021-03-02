import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ProductoDetailPage,
  },
];

import { ProductoDetailPage } from './producto-detail.page';
import { CommonUiCoreModule } from '@papx/common/ui-core';

@NgModule({
  imports: [CommonUiCoreModule, RouterModule.forChild(routes)],
  declarations: [ProductoDetailPage],
})
export class ProductoDetailPageModule {}
