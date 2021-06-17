import { NgModule } from '@angular/core';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { CommonUiCoreModule } from '@papx/common/ui-core';
import { CommonUiForms } from '@papx/common/ui-forms';

import { ProductoControlComponent } from './producto-control.component';

@NgModule({
  imports: [
    CommonUiCoreModule,
    CommonUiForms,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatAutocompleteModule,
  ],
  declarations: [ProductoControlComponent],
  exports: [ProductoControlComponent],
  providers: [],
})
export class ProductoControlModule {}
