import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { RechazadasPage } from './rechazadas.page';
import { RechazadasListComponent } from './list-view/rechazadas-list.component';
import { RechazadaItemComponent } from './list-view/rechazada-item.component';
import { CommonUiCoreModule } from '@papx/common/ui-core';

@NgModule({
  imports: [
    CommonUiCoreModule,
    RouterModule.forChild([
      {
        path: '',
        component: RechazadasPage,
      },
    ]),
  ],
  declarations: [
    RechazadasPage,
    RechazadasListComponent,
    RechazadaItemComponent,
  ],
})
export class RechazadasPageModule {}
