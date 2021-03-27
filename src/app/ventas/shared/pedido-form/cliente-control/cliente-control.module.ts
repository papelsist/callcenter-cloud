import { NgModule } from '@angular/core';
import { CommonUiCoreModule } from '@papx/common/ui-core';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { ClienteControlComponent } from './cliente-control.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonUiCoreModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatAutocompleteModule,
  ],
  exports: [ClienteControlComponent],
  declarations: [ClienteControlComponent],
  providers: [],
})
export class ClienteControlModule {}
