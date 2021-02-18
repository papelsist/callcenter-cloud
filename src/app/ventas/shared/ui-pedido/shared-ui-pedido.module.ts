import { NgModule } from '@angular/core';

import { CommonUiCoreModule } from '@papx/common/ui-core';
import { CommonUiForms } from '@papx/common/ui-forms';

import { ClienteFieldComponent } from './cliente-field/cliente-field.component';
import { PedidoCreateFormComponent } from './create-form/pcreate-form.component';
import { TipoDePedidoComponent } from './tipo-field/tipo-de-pedido-field.component';
import { PedidoItemListComponent } from './pedido-item-list/pedido-item-list.component';
import { PedidoItemComponent } from './pedido-item/pedido-item.component';

const components = [
  ClienteFieldComponent,
  PedidoCreateFormComponent,
  TipoDePedidoComponent,
  PedidoItemComponent,
  PedidoItemListComponent,
];

@NgModule({
  imports: [CommonUiCoreModule, CommonUiForms],
  exports: [...components],
  declarations: [...components],
})
export class SharedUiPedidoModule {}
