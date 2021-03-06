import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonUiCoreModule } from '@papx/common/ui-core';

import { ClienteSelectorComponent } from './cliente-selector.component';
import { ClienteSelectorController } from './cliente-selector.controller';

@NgModule({
  imports: [CommonUiCoreModule],
  exports: [ClienteSelectorComponent],
  declarations: [ClienteSelectorComponent],
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
