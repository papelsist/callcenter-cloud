import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { FilterVentasButtonComponent } from './filter-ventas/filter-button.component';
import { VentasHeaderComponent } from './ventas-header/ventas-header.component';

const COMPONENTS = [VentasHeaderComponent, FilterVentasButtonComponent];

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
})
export class SharedVentasModule {}
