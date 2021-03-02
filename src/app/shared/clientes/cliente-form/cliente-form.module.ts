import { NgModule } from '@angular/core';
import { CommonUiCoreModule } from '@papx/common/ui-core';
import { CommonUiForms } from '@papx/common/ui-forms';
import { DireccionModule } from '@papx/shared/direccion';
import { ClienteFormComponent } from './cliente-form.component';

@NgModule({
  imports: [CommonUiCoreModule, CommonUiForms, DireccionModule],
  exports: [ClienteFormComponent],
  declarations: [ClienteFormComponent],
})
export class SharedClienteFormModule {}
