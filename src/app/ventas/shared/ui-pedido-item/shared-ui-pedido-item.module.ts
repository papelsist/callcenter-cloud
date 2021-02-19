import { NgModule } from '@angular/core';
import { CommonUiCoreModule } from '@papx/common/ui-core';
import { CommonUiForms } from '@papx/common/ui-forms';
import { ProductoSelectorModule } from '@papx/shared/productos/producto-selector';

import { ItemFormComponent } from './item-form/item-form.component';
import { ItemModalComponent } from './item-modal/item-modal.component';

import { ItemController } from './item.controller';
import { ITEM_FORM_FIELDS } from './item-form';

@NgModule({
  imports: [CommonUiCoreModule, CommonUiForms, ProductoSelectorModule],
  exports: [],
  declarations: [ItemModalComponent, ItemFormComponent, ...ITEM_FORM_FIELDS],
  providers: [ItemController, ItemFormComponent],
})
export class SharedUiPedidoItemModule {}
