import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientePageRoutingModule } from './cliente-routing.module';

import { ClientePage } from './cliente.page';
import { CommonUiCoreModule } from '@papx/common/ui-core';
import { CommonUiForms } from '@papx/common/ui-forms';
import { DireccionModule } from '@papx/shared/direccion';

@NgModule({
  imports: [
    CommonUiCoreModule,
    CommonUiForms,
    DireccionModule,
    ClientePageRoutingModule,
  ],
  declarations: [ClientePage],
})
export class ClientePageModule {}
