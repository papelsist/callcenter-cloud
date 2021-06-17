import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VentasTabPageRoutingModule } from './ventas-tab-routing.module';

import { VentasTabPage } from './ventas-tab.page';
import { ReportsModule } from '@papx/shared/reports/reports.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportsModule,
    VentasTabPageRoutingModule,
  ],
  declarations: [VentasTabPage],
})
export class VentasTabPageModule {}
