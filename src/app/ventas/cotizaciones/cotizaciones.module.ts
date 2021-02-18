import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CotizacionesPage } from './cotizaciones.page';
import { SharedVentasModule } from '../shared/shared-ventas.module';
import { VentasDataAccesModule } from '../@data-access/ventas-data-access.module';

const routes: Routes = [
  {
    path: '',
    component: CotizacionesPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedVentasModule,
    VentasDataAccesModule,
    RouterModule.forChild(routes),
  ],
  declarations: [CotizacionesPage],
})
export class CotizacionesPageModule {}
