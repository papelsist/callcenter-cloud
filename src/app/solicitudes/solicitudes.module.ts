import { NgModule } from '@angular/core';

import { SolicitudesTabPageRoutingModule } from './solicitudes-routing.module';

import { SolicitudesPage } from './solicitudes.page';
import { CommonUiCoreModule } from '@papx/common/ui-core';
import { SharedUiSolicitudesModule } from '@papx/shared/ui-solicitudes';

@NgModule({
  imports: [
    CommonUiCoreModule,
    SharedUiSolicitudesModule,
    SolicitudesTabPageRoutingModule,
  ],
  declarations: [SolicitudesPage],
})
export class SolicitudesPageModule {}
