import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

// libs
import { throwIfAlreadyLoaded } from '../utils';

// app
import { DataAccessModule } from '@papx/data-access';
import { AuthModule } from '../@auth/auth.module';

@NgModule({
  imports: [CommonModule, HttpClientModule, DataAccessModule, AuthModule],
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule
  ) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
