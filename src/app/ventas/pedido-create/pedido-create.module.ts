import { NgModule } from '@angular/core';

import { CommonUiCoreModule } from '@papx/common/ui-core';
import { CommonUiForms } from '@papx/common/ui-forms';

import { PedidoCreatePageRoutingModule } from './pedido-create-routing.module';

import { PedidoCreatePage } from './pedido-create.page';
import { SharedUiPedidoModule } from '../shared/ui-pedido';
import { SharedUiPedidoItemModule } from '../shared/ui-pedido-item';

@NgModule({
  imports: [
    CommonUiCoreModule,
    CommonUiForms,
    SharedUiPedidoModule,
    SharedUiPedidoItemModule,
    PedidoCreatePageRoutingModule,
  ],
  declarations: [PedidoCreatePage],
})
export class PedidoCreatePageModule {}
