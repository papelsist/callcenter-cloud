import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { DireccionEditComponent } from './direccion-edit.component';
import { DireccionEntregaComponent } from './direccion-entrega/direccion-entrega.component';
import { DireccionFormComponent } from './direccion-form/direccion-form.component';
import { DireccionComponent } from './direccion.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule],
  declarations: [
    DireccionComponent,
    DireccionEditComponent,
    DireccionFormComponent,
    DireccionEntregaComponent,
  ],
  exports: [
    DireccionComponent,
    DireccionEditComponent,
    DireccionFormComponent,
    DireccionEntregaComponent,
  ],
})
export class DireccionModule {}
