import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { BancoFieldComponent } from './banco-field/banco-field.component';
import { CuentaFieldComponent } from './cuenta-field/cuenta-field.component';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [BancoFieldComponent, CuentaFieldComponent],
  exports: [BancoFieldComponent, CuentaFieldComponent],
})
export class SharedUiBancosModule {}
