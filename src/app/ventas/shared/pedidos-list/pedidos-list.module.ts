import { NgModule } from '@angular/core';
import { CommonUiCoreModule } from '@papx/common/ui-core';
import { PedidosListComponent } from './pedidos-list.component';

@NgModule({
  imports: [CommonUiCoreModule],
  exports: [PedidosListComponent],
  declarations: [PedidosListComponent],
})
export class SharedPedidosListModule {}
