import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { LoadingService } from './loading/loading.service';

@NgModule({
  imports: [CommonModule, IonicModule],
  exports: [CommonModule, IonicModule],
  providers: [LoadingService],
})
export class CommonUiCoreModule {}
