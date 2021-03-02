import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuscarPageRoutingModule } from './buscar-routing.module';

import { BuscarPage } from './buscar.page';
import { CommonUiCoreModule } from '@papx/common/ui-core';
import { CommonUiForms } from '@papx/common/ui-forms';
import { SharedClienteFormModule } from '@papx/shared/clientes/cliente-form/cliente-form.module';

@NgModule({
  imports: [
    CommonUiCoreModule,
    CommonUiForms,
    SharedClienteFormModule,
    BuscarPageRoutingModule,
  ],
  declarations: [BuscarPage],
})
export class BuscarPageModule {}
