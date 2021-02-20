import { CorteFieldComponent } from './corte-field.component';
import { ExistenciaFieldComponent } from './existencia-field.component';
import { InstruccionFieldComponent } from './instruccion-field.component';
import { PedidoItemValidationComponent } from './pedido-item-validation.component';
import { ProductoFieldComponent } from './producto-field.component';

export const ITEM_FORM_FIELDS = [
  CorteFieldComponent,
  InstruccionFieldComponent,
  ProductoFieldComponent,
  ExistenciaFieldComponent,
  PedidoItemValidationComponent,
];

export * from './corte-field.component';
export * from './instruccion-field.component';
export * from './producto-field.component';
export * from './existencia-field.component';
export * from './pedido-item-validation.component';
