import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { DireccionEditComponent } from './direccion-edit.component';
import { DireccionComponent } from './direccion.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule],
  declarations: [DireccionComponent, DireccionEditComponent],
  exports: [DireccionComponent, DireccionEditComponent],
})
export class DireccionModule {}
