import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VentasTabPageRoutingModule } from './ventas-tab-routing.module';

import { VentasTabPage } from './ventas-tab.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VentasTabPageRoutingModule
  ],
  declarations: [VentasTabPage]
})
export class VentasTabPageModule {}
