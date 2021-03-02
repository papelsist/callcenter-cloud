import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClienteExistsGuard } from '@papx/shared/clientes/@data-access/guards/cliente-exists.guard';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'buscar',
        loadChildren: () =>
          import('../pages/buscar/buscar.module').then(
            (m) => m.BuscarPageModule
          ),
      },
      {
        path: 'edit/:clienteId',
        loadChildren: () =>
          import('../pages/cliente/cliente.module').then(
            (m) => m.ClientePageModule
          ),
        canActivate: [ClienteExistsGuard],
      },
      {
        path: 'favoritos',
        loadChildren: () =>
          import('../pages/favoritos/favoritos.module').then(
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
