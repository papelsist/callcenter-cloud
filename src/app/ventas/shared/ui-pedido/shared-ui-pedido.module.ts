import { NgModule } from '@angular/core';

import { CommonUiCoreModule } from '@papx/common/ui-core';
import { CommonUiForms } from '@papx/common/ui-forms';

import { ClienteFieldComponent } from './cliente-field/cliente-field.component';
import { PedidoCreateFormComponent } from './create-form/pcreate-form.component';
import { TipoDePedidoComponent } from './tipo-field/tipo-de-pedido-field.component';
import { PedidoItemListComponent } from './pedido-item-list/pedido-item-list.component';
import { PedidoItemComponent } from './pedido-item/pedido-item.component';
import { ResumenSectionComponent } from './create-form/sections/resumen-section/resumen-section.component';
import { EnvioModule } from './envio/envio.module';
import { CorteItemsListComponent } from './corte-items/corte-items-list.component';
import { PedidoValidationComponent } from './validation/pedido-validation.component';

const components = [
  ClienteFieldComponent,
  PedidoCreateFormComponent,
  TipoDePedidoComponent,
  PedidoItemComponent,
  PedidoItemListComponent,
  ResumenSectionComponent,
  CorteItemsListComponent,
  PedidoValidationComponent,
];

@NgModule({
  imports: [CommonUiCoreModule, CommonUiForms, EnvioModule],
  exports: [...components],
  declarations: [...components],
})
export class SharedUiPedidoModule {}
