import { NgModule } from '@angular/core';

import { EnvioComponent } from './envio.component';
import { EnvioTipoComponent } from './envio-tipo.component';
import { EnvioHorarioFieldComponent } from './envio-horario-field.component';
import { EnvioDireccionComponent } from './envio-direccion.component';
import { DireccionModule } from '@papx/shared/direccion';
import { CommonUiForms } from '@papx/common/ui-forms';
import { CommonUiCoreModule } from '@papx/common/ui-core';

@NgModule({
  imports: [CommonUiCoreModule, CommonUiForms, DireccionModule],
  declarations: [
    EnvioComponent,
    EnvioTipoComponent,
    EnvioDireccionComponent,
    EnvioHorarioFieldComponent,
  ],
  providers: [],
  exports: [EnvioComponent],
})
export class EnvioModule {}
