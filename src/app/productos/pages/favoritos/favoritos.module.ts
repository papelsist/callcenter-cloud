import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonUiCoreModule } from '@papx/common/ui-core';

const routes: Routes = [
  {
    path: '',
    component: FavoritosPage,
  },
];

import { FavoritosPage } from './favoritos.page';

@NgModule({
  imports: [CommonUiCoreModule, RouterModule.forChild(routes)],
  declarations: [FavoritosPage],
})
export class FavoritosPageModule {}
