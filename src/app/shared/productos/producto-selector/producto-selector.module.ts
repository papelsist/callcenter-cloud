import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonUiCoreModule } from '@papx/common/ui-core';

import { ProductoSelectorComponent } from './producto-selector.component';
import { ProductoController } from './producto.controller';

@NgModule({
  imports: [CommonUiCoreModule],
  exports: [ProductoSelectorComponent],
  declarations: [ProductoSelectorComponent],
})
export class ProductoSelectorModule {
  static forRoot(): ModuleWithProviders<ProductoSelectorModule> {
    return {
      ngModule: ProductoSelectorModule,
      providers: [ProductoController],
    };
  }
}
