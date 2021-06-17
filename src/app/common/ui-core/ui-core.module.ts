import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AgGridModule } from 'ag-grid-angular';
import { LoadingService } from './loading/loading.service';

import { IconRendererComponent } from './renderes/icon-renderer.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    AgGridModule.withComponents([IconRendererComponent]),
  ],
  declarations: [IconRendererComponent],
  exports: [CommonModule, IonicModule, AgGridModule],
  providers: [LoadingService],
})
export class CommonUiCoreModule {}
