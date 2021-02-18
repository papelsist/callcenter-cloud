import { NgModule } from '@angular/core';

import { CommonUiCoreModule } from '@papx/common/ui-core';
import { CommonUiForms } from '@papx/common/ui-forms';

import { PedidoCreatePageRoutingModule } from './pedido-create-routing.module';

import { PedidoCreatePage } from './pedido-create.page';
import { SharedUiPedidoModule } from '../shared/ui-pedido/shared-ui-pedido.module';

@NgModule({
  imports: [
    CommonUiCoreModule,
    CommonUiForms,
    SharedUiPedidoModule,
    PedidoCreatePageRoutingModule,
  ],
  declarations: [PedidoCreatePage],
})
export class PedidoCreatePageModule {}
