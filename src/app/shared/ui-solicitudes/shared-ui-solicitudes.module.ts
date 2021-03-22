import { NgModule } from '@angular/core';

import { CommonUiCoreModule } from '@papx/common/ui-core';
import { CommonUiForms } from '@papx/common/ui-forms';

import { SharedUiBancosModule } from '@papx/shared/ui-bancos';
import { SolicitudCardComponent } from './solicitud-card/solicitud-card.component';

import { SolicitudDetailComponent } from './solicitud-detail/solicitud-detail.component';
import { SolicitudDetailModalComponent } from './solicitud-detail-modal/solicitud-detail-modal.component';

@NgModule({
  imports: [CommonUiCoreModule, CommonUiForms, SharedUiBancosModule],
  declarations: [
    SolicitudCardComponent,
    SolicitudDetailComponent,
    SolicitudDetailModalComponent,
  ],
  exports: [
    SolicitudCardComponent,
    SolicitudDetailComponent,
    SolicitudDetailModalComponent,
  ],
})
export class SharedUiSolicitudesModule {}
