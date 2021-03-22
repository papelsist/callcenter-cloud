import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonUiCoreModule } from '@papx/common/ui-core';
import { ClienteSelectorFieldComponent } from './cliente-selector-field/cliente-selector-field.component';

import { ClienteSelectorComponent } from './cliente-selector.component';
import { ClienteSelectorController } from './cliente-selector.controller';

@NgModule({
  imports: [CommonUiCoreModule],
  exports: [ClienteSelectorComponent, ClienteSelectorFieldComponent],
  declarations: [ClienteSelectorComponent, ClienteSelectorFieldComponent],
  providers: [],
})
export class ClienteSelectorModule {
  static forRoot(): ModuleWithProviders<ClienteSelectorModule> {
    return {
      ngModule: ClienteSelectorModule,
      providers: [ClienteSelectorController],
    };
  }
}
