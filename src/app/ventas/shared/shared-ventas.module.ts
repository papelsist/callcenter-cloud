import { NgModule } from '@angular/core';

import { CommonUiCoreModule } from '@papx/common/ui-core';
import {
  ErrorsButtonComponent,
  ErrorsComponent,
  WarningsButtonComponent,
  WarningsComponent,
} from './buttons';
import { FilterVentasButtonComponent } from './buttons';
import { VentasHeaderComponent } from './ventas-header/ventas-header.component';

const COMPONENTS = [
  VentasHeaderComponent,
  FilterVentasButtonComponent,
  WarningsButtonComponent,
  WarningsComponent,
  ErrorsComponent,
  ErrorsButtonComponent,
];

@NgModule({
  imports: [CommonUiCoreModule],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
})
export class SharedVentasModule {}
