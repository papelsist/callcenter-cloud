import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CommonUiCoreModule } from '@papx/common/ui-core';
import { COMPONENTS } from './components';
import { PedidosLogFacade } from './pedidos-log.facade';
import { PedidosLogPageComponent } from './pedidos-log.page.component';

@NgModule({
  imports: [
    CommonUiCoreModule,
    RouterModule.forChild([
      {
        path: '',
        component: PedidosLogPageComponent,
      },
    ]),
  ],
  providers: [PedidosLogFacade],
  exports: [PedidosLogPageComponent],
  declarations: [PedidosLogPageComponent, ...COMPONENTS],
})
export class PedidosPendientesLogModule {}
