import { NgModule } from '@angular/core';

import { CommonUiCoreModule } from '@papx/common/ui-core';
import { FilterVentasButtonComponent } from './filter-ventas/filter-button.component';
import { VentasHeaderComponent } from './ventas-header/ventas-header.component';

const COMPONENTS = [VentasHeaderComponent, FilterVentasButtonComponent];

@NgModule({
  imports: [CommonUiCoreModule],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
})
export class SharedVentasModule {}
