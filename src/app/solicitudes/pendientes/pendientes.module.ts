import { NgModule } from '@angular/core';

import { PendientesPageRoutingModule } from './pendientes-routing.module';

import { PendientesPage } from './pendientes.page';

import { SolicitudesPendientesListComponent } from './list/pendientes-list.component';
import { CommonUiCoreModule } from '@papx/common/ui-core';

@NgModule({
  imports: [CommonUiCoreModule, PendientesPageRoutingModule],
  declarations: [PendientesPage, SolicitudesPendientesListComponent],
})
export class PendientesPageModule {}
