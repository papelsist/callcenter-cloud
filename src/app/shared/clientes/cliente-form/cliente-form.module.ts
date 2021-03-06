import { NgModule } from '@angular/core';
import { CommonUiCoreModule } from '@papx/common/ui-core';
import { CommonUiForms } from '@papx/common/ui-forms';
import { DireccionModule } from '@papx/shared/direccion';
import { ClienteFormComponent } from './cliente-form.component';
import { ClienteFormController } from './cliente-form.controller';

@NgModule({
  imports: [CommonUiCoreModule, CommonUiForms, DireccionModule],
  exports: [ClienteFormComponent],
  declarations: [ClienteFormComponent],
  providers: [ClienteFormController],
})
export class SharedClienteFormModule {}
