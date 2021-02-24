import { NgModule } from '@angular/core';

import { CommonUiCoreModule } from '@papx/common/ui-core';
import { CommonUiForms } from '@papx/common/ui-forms';

import { PedidoCreateFormComponent } from './create-form';
import { ClienteFieldComponent } from './cliente-field/cliente-field.component';
import { TipoDePedidoComponent } from './tipo-field/tipo-de-pedido-field.component';
import { PedidoItemListComponent } from './pedido-item-list/pedido-item-list.component';
import { PedidoItemComponent } from './pedido-item/pedido-item.component';
import { ResumenSectionComponent, CorteItemsListComponent } from './+sections';
import { EnvioModule } from './envio';

import { PedidoValidationComponent } from './validation/pedido-validation.component';

const components = [
  PedidoCreateFormComponent,
  ClienteFieldComponent,
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
export class SharedPedidoFormModule {}
