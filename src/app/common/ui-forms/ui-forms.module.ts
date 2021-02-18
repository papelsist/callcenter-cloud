import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormaDePagoControlComponent } from './forma-pago-control/forma-pago-control.component';
import { MonedaControlComponent } from './moneda-control/moneda-control.component';
import { SucursalControlComponent } from './sucursal-control/sucursal-control.component';

const controls = [
  SucursalControlComponent,
  FormaDePagoControlComponent,
  MonedaControlComponent,
];

@NgModule({
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule],
  exports: [...controls, FormsModule, ReactiveFormsModule],
  declarations: [...controls],
})
export class CommonUiForms {}
