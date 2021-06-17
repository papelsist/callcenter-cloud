import { NgModule } from '@angular/core';

import { CommonUiCoreModule } from '@papx/common/ui-core';
import { CommonUiForms } from '@papx/common/ui-forms';

import { SharedUiBancosModule } from '@papx/shared/ui-bancos';
import { SolicitudCardComponent } from './solicitud-card/solicitud-card.component';

import { SolicitudDetailComponent } from './solicitud-detail/solicitud-detail.component';
import { SolicitudDetailModalComponent } from './solicitud-detail-modal/solicitud-detail-modal.component';
import { RechazoInfoComponent } from './rechazo-info/rechazo-info.component';

@NgModule({
  imports: [CommonUiCoreModule, CommonUiForms, SharedUiBancosModule],
  declarations: [
    SolicitudCardComponent,
    SolicitudDetailComponent,
    SolicitudDetailModalComponent,
    RechazoInfoComponent,
  ],
  exports: [
    SolicitudCardComponent,
    SolicitudDetailComponent,
    SolicitudDetailModalComponent,
    RechazoInfoComponent,
  ],
})
export class SharedUiSolicitudesModule {}
