import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormaDePago, PedidoItemParams, TipoDePedido } from '@papx/models';
import { ItemValitators } from './item.validators';

/**
 * Pure factory function
 */
export function buildForm(builder: FormBuilder): FormGroup {
  const form = builder.group({
    // tantos: [{ value: null }],
    producto: [null, [Validators.required]],
    descripcion: [{ value: null, disabled: true }],
    cantidad: [
      { value: 0.0, disabled: false },
      { validators: [Validators.required, Validators.min(1)] },
    ],
    precio: [
      { value: null, disabled: true },
      [Validators.required, Validators.min(1.0)],
    ],
    importe: [{ value: 0.0, disabled: true }],
    descuento: [{ value: 0.0, disabled: true }],
    descuentoEspecial: [{ value: 0.0, disabled: true }],
    descuentoImporte: [{ value: 0.0, disabled: true }],
    subtotal: [{ value: 0.0, disabled: true }],
    impuesto: [{ value: 0.0, disabled: true }],
    total: [{ value: 0.0, disabled: true }],
    comentario: [''],
    corte: builder.group(
      {
        tantos: [{ value: null }],
        instruccion: [null],
        instruccionEspecial: [{ value: null, disabled: true }],
        cantidad: [0],
        precio: [10.0],
        refinado: false,
        limpio: false,
      },
      { validators: [ItemValitators.corteValidator] }
    ),
  });
  return form;
}

export function getParams(): PedidoItemParams {
  return {
    tipo: TipoDePedido.CONTADO,
    formaDePago: FormaDePago.EFECTIVO,
    descuento: 0,
  };
}
