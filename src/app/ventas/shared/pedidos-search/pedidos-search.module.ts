import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonUiCoreModule } from '@papx/common/ui-core';
import { PedidosSearchComponent } from './pedidos-search-btn.component';
import { PedidosSearchModalComponent } from './pedidos-search-modal.component';

@NgModule({
  imports: [CommonUiCoreModule, FormsModule, ReactiveFormsModule],
  exports: [PedidosSearchComponent, PedidosSearchModalComponent],
  declarations: [PedidosSearchComponent, PedidosSearchModalComponent],
  providers: [],
})
export class PedidosSearchModule {}
