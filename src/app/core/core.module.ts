import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

// libs
import { throwIfAlreadyLoaded } from '../utils';

// app
import { DataAccessModule } from '@papx/data-access';
import { VentasDataAccesModule } from '../ventas/@data-access/ventas-data-access.module';
import { ClienteDataAccessModule } from '@papx/shared/clientes/@data-access/cliente-data-access.module';
import { ProductoDataAccessModules } from '@papx/shared/productos/data-access';
import { AuthModule } from '../@auth/auth.module';

import { ProductoSelectorModule } from '@papx/shared/productos/producto-selector';
import { ClienteSelectorModule } from '@papx/shared/clientes/cliente-selector';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    DataAccessModule,
    AuthModule,
    ClienteDataAccessModule,
    ProductoDataAccessModules,
    VentasDataAccesModule,
    ProductoSelectorModule.forRoot(),
    ClienteSelectorModule.forRoot(),
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
