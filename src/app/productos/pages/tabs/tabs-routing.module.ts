import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'buscar',
        loadChildren: () =>
          import('../buscar/buscar.module').then((m) => m.BuscarPageModule),
      },
      {
        path: 'buscar/:productoId',
        loadChildren: () =>
          import('../producto-detail/producto-detail.module').then(
            (m) => m.ProductoDetailPageModule
          ),
      },
      {
        path: 'lineas',
        loadChildren: () =>
          import('../lineas/lineas.module').then((m) => m.LineasPageModule),
      },
      {
        path: 'favoritos',
        loadChildren: () =>
          import('../favoritos/favoritos.module').then(
            (m) => m.FavoritosPageModule
          ),
      },
      {
        path: '',
        redirectTo: 'buscar',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'buscar',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
