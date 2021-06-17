import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { CommonUiCoreModule } from '@papx/common/ui-core';
import {
  EmailTargetComponent,
  ErrorsButtonComponent,
  ErrorsComponent,
  WarningsButtonComponent,
  WarningsComponent,
} from './buttons';
import { FilterVentasButtonComponent } from './buttons';
import { CerrarPedidoComponent } from './cerrar-pedido/cerrar-pedido.component';
import { VentasHeaderComponent } from './ventas-header/ventas-header.component';

const COMPONENTS = [
  VentasHeaderComponent,
  FilterVentasButtonComponent,
  WarningsButtonComponent,
  WarningsComponent,
  ErrorsComponent,
  ErrorsButtonComponent,
  EmailTargetComponent,
  CerrarPedidoComponent,
];

@NgModule({
  imports: [CommonUiCoreModule, ReactiveFormsModule],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
})
export class SharedVentasModule {}
