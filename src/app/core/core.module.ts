import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

// libs
import { throwIfAlreadyLoaded } from '../utils';

// app
import { environment } from '../../environments/environment';
import { DataAccessModule } from '@papx/data-access';
import { AuthModule } from '@papx/auth';

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
