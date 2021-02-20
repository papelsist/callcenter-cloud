import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

// libs
import { throwIfAlreadyLoaded } from '../utils';

// app
import { DataAccessModule } from '@papx/data-access';
import { AuthModule } from '../@auth/auth.module';
import { ProductoSelectorModule } from '../shared/productos/producto-selector/producto-selector.module';
import { VentasDataAccesModule } from '../ventas/@data-access/ventas-data-access.module';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    DataAccessModule,
    AuthModule,
    ProductoSelectorModule.forRoot(),
    VentasDataAccesModule,
  ],
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
