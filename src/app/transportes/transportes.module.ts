import { NgModule } from '@angular/core';

import { TransportesPageRoutingModule } from './transportes-routing.module';

import { TransportesPage } from './transportes.page';
import { TransporteFormComponent } from './trasnporte-form/transporte-form.component';
import { CommonUiCoreModule } from '@papx/common/ui-core';
import { CommonUiForms } from '@papx/common/ui-forms';
import { DireccionModule } from '@papx/shared/direccion';

@NgModule({
  imports: [
    CommonUiCoreModule,
    CommonUiForms,
    DireccionModule,
    TransportesPageRoutingModule,
  ],
  declarations: [TransportesPage, TransporteFormComponent],
})
export class TransportesPageModule {}
