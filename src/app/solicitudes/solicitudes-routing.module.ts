import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SolicitudesPage } from './solicitudes.page';

const routes: Routes = [
  {
    path: '',
    component: SolicitudesPage,
    children: [
      {
        path: 'pendientes',
        loadChildren: () =>
          import('./pendientes/pendientes.module').then(
            (m) => m.PendientesPageModule
          ),
      },
      {
        path: 'rechazadas',
        loadChildren: () =>
          import('./rechazadas/rechazadas.module').then(
            (m) => m.RechazadasPageModule
          ),
      },
      {
        path: 'autorizadas',
        loadChildren: () =>
          import('./autorizadas/autorizadas.module').then(
            (m) => m.AutorizadasPageModule
          ),
      },

      {
        path: '',
        redirectTo: '/solicitudes/pendientes',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'create',
    loadChildren: () =>
      import('./create-solicitud/create-solicitud.module').then(
        (m) => m.CreateSolicitudPageModule
      ),
  },
  {
    path: 'rechazadas/:solicitudId',
    loadChildren: () =>
      import('./edit-solicitud/edit-solicitud.module').then(
        (m) => m.EditSolicitudPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SolicitudesTabPageRoutingModule {}
