import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonUiCoreModule } from '@papx/common/ui-core';

import { COMPONENTS } from './components';
import { EmbarquesLogPageComponent } from './embarques-log.page.component';
import { EmbarquesFacade } from './embarques.facade';

@NgModule({
  imports: [
    CommonUiCoreModule,
    RouterModule.forChild([
      {
        path: '',
        component: EmbarquesLogPageComponent,
      },
    ]),
  ],
  exports: [],
  declarations: [EmbarquesLogPageComponent, ...COMPONENTS],
  providers: [EmbarquesFacade],
})
export class EmbarquesLogModule {}
