import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { throwIfAlreadyLoaded } from '@papx/utils';

@NgModule({
  imports: [CommonModule],
  exports: [],
  providers: [],
})
export class VentasDataAccesModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: VentasDataAccesModule
  ) {
    throwIfAlreadyLoaded(parentModule, 'VentasDataAccesModule');
  }
}
