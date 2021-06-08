import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import { CommonUiCoreModule } from '@papx/common/ui-core';
import { XPedidoCreateComponent } from './xpedido.create.component';

const routes: Routes = [
  {
    path: '',
    component: XPedidoCreateComponent,
  },
];

@NgModule({
  imports: [CommonUiCoreModule, RouterModule.forChild(routes)],
  exports: [],
  declarations: [XPedidoCreateComponent],
  providers: [],
})
export class XPedidosCreateModule {}
