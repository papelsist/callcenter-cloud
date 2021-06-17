import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PedidoViewPage } from './pedido-view.page';
import { CommonUiCoreModule } from '@papx/common/ui-core';
import { SharedPedidoFormModule } from '../shared/pedido-form';
import { SharedUiPedidoItemModule } from '../shared/ui-pedido-item';
import { SharedVentasModule } from '../shared/shared-ventas.module';
import { PedidoExistsGuard } from '../@data-access/guards/pedido.exists.guard';
import { COMPONENTS } from './components';

@NgModule({
  imports: [
    CommonUiCoreModule,
    SharedPedidoFormModule,
    SharedUiPedidoItemModule,
    SharedVentasModule,
    RouterModule.forChild([
      {
        path: '',
        component: PedidoViewPage,
        canActivate: [PedidoExistsGuard],
      },
    ]),
  ],
  declarations: [PedidoViewPage, [...COMPONENTS]],
  exports: [...COMPONENTS],
})
export class PedidoViewPageModule {}
