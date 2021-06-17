import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonUiCoreModule } from '@papx/common/ui-core';

import { ClienteSelectorModule } from '@papx/shared/clientes/cliente-selector';
import { ProductoControlModule } from '@papx/shared/productos/producto-control/producto-control.module';
import { XpedidoCreateFormComponent } from './xpedido-create-form.component';

@NgModule({
  imports: [
    CommonUiCoreModule,
    ReactiveFormsModule,
    ClienteSelectorModule,
    ProductoControlModule,
  ],
  exports: [XpedidoCreateFormComponent],
  declarations: [XpedidoCreateFormComponent],
  providers: [],
})
export class XpedidoCreateFormModule {}
