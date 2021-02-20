import { NgModule } from '@angular/core';

import { PedidoItemPageRoutingModule } from './pedido-item-routing.module';

import { PedidoItemPage } from './pedido-item.page';
import { CommonUiCoreModule } from '@papx/common/ui-core';
import { CommonUiForms } from '@papx/common/ui-forms';
import { SharedUiPedidoItemModule } from '../shared/ui-pedido-item';

@NgModule({
  imports: [
    CommonUiCoreModule,
    CommonUiForms,
    SharedUiPedidoItemModule,
    PedidoItemPageRoutingModule,
  ],
  declarations: [PedidoItemPage],
})
export class PedidoItemPageModule {}
