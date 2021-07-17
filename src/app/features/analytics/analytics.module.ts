import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AnalyticsPageComponent } from './analytics.page.component';

const routes: Routes = [
  {
    path: '',
    component: AnalyticsPageComponent,
    children: [
      {
        path: 'pendientes',
        loadChildren: () =>
          import('./pedidos-log/pendientes-log.module').then(
            (m) => m.PedidosPendientesLogModule
          ),
      },
      {
        path: 'embarques',
        loadChildren: () =>
          import('./embarques-log/embarques-log.module').then(
            (m) => m.EmbarquesLogModule
          ),
      },
      {
        path: 'analisis',
        loadChildren: () =>
          import('./analisis/analisis.module').then((m) => m.AnalisisModule),
      },
      {
        path: '',
        redirectTo: 'pendientes',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, IonicModule, RouterModule.forChild(routes)],
  declarations: [AnalyticsPageComponent],
})
export class AnalyticsModule {}
