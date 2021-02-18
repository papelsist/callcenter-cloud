import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PedidoEditPageRoutingModule } from './pedido-edit-routing.module';

import { PedidoEditPage } from './pedido-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PedidoEditPageRoutingModule
  ],
  declarations: [PedidoEditPage]
})
export class PedidoEditPageModule {}
