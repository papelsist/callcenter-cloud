import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';

// import { SharedUiClientesModule } from '@papx/shared/ui-clientes';
import { SharedUiBancosModule } from '@papx/shared/ui-bancos';

import { CreateSolicitudPage } from './create-solicitud.page';
import { SolicitudCreateFormComponent } from './create-form/solicitud-create-form.component';
import { CarteraSelectorComponent } from './cartera-selector/cartera-selector.component';
import { CarterasPopoverComponent } from './cartera-selector/carteras-popover.component';
import { CommonUiCoreModule } from '@papx/common/ui-core';
import { CommonUiForms } from '@papx/common/ui-forms';
import { ClienteSelectorModule } from '@papx/shared/clientes/cliente-selector';

@NgModule({
  imports: [
    CommonUiCoreModule,
    CommonUiForms,
    ClienteSelectorModule,
    SharedUiBancosModule,
    RouterModule.forChild([
      {
        path: '',
        component: CreateSolicitudPage,
      },
    ]),
  ],
  declarations: [
    CreateSolicitudPage,
    SolicitudCreateFormComponent,
    CarteraSelectorComponent,
    CarterasPopoverComponent,
  ],
})
export class CreateSolicitudPageModule {}
