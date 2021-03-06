import { NgModule } from '@angular/core';

import { CommonUiCoreModule } from '@papx/common/ui-core';
import { CommonUiForms } from '@papx/common/ui-forms';

import { PedidoCreatePageRoutingModule } from './pedido-create-routing.module';

import { PedidoCreatePage } from './pedido-create.page';
import { SharedPedidoFormModule } from '../shared/pedido-form';
import { SharedUiPedidoItemModule } from '../shared/ui-pedido-item';
import { SharedVentasModule } from '../shared/shared-ventas.module';

@NgModule({
  imports: [
    CommonUiCoreModule,
    CommonUiForms,
    SharedPedidoFormModule,
    SharedUiPedidoItemModule,
    SharedVentasModule,
    PedidoCreatePageRoutingModule,
  ],
  declarations: [PedidoCreatePage],
})
export class PedidoCreatePageModule {}
