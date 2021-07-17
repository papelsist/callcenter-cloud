import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonUiCoreModule } from '@papx/common/ui-core';
import { AnalisisFacade } from './analisis.facade';
import { AnalisisPageComponent } from './analisis.page.component';
import { COMPONENTS } from './components';

@NgModule({
  imports: [
    HttpClientModule,
    CommonUiCoreModule,
    RouterModule.forChild([
      {
        path: '',
        component: AnalisisPageComponent,
      },
    ]),
  ],
  exports: [],
  declarations: [AnalisisPageComponent, ...COMPONENTS],
  providers: [AnalisisFacade],
})
export class AnalisisModule {}
