import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Corte,
  FormaDePago,
  PedidoDet,
  PedidoSummary,
  Producto,
  TipoDePedido,
} from '@papx/models';
import { ItemValitators } from './item.validators';

import round from 'lodash-es/round';

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
    faltante: [0.0],
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
        tantos: [{ value: null }, { updateOn: 'blur' }],
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

// export function getParams(): PedidoItemParams {
//   return {
//     tipo: TipoDePedido.CONTADO,
//     formaDePago: FormaDePago.EFECTIVO,
//     descuento: 0,
//     sucursal: 'TACUBA',
//   };
// }

/**
 * Copia las propiedades del producto que se ocupan en PedidoDet
 *
 * @param producto
 */
export function extractData(producto: Producto): Partial<PedidoDet> {
  const {
    clave,
    descripcion,
    unidad,
    presentacion,
    gramos,
    nacional,
    modoVenta,
  } = producto;
  return {
    clave,
    descripcion,
    unidad,
    presentacion,
    gramos,
    nacional,
    modoVenta,
    producto: reduceProducto(producto),
  };
}

export function reduceProducto(producto: Producto) {
  const {
    id,
    clave,
    descripcion,
    precioCredito,
    precioContado,
    unidad,
    kilos,
    gramos,
    modoVenta,
    presentacion,
  } = producto;
  return {
    id,
    clave,
    descripcion,
    precioCredito,
    precioContado,
    unidad,
    kilos,
    gramos,
    modoVenta,
    presentacion,
  };
}

export function calcularKilos(cantidad: number, producto: Producto) {
  const factor = producto.unidad === 'MIL' ? 1 / 1000 : 1;
  const kilos = cantidad * factor * producto.kilos;
  return round(kilos, 3);
}

export function buildPedidoItem(
  // params: PedidoItemParams,
  tipo: TipoDePedido,
  formData: any
): Partial<PedidoDet> {
  const corte: Corte = formData.corte;
  const producto: Producto = formData.producto;
  const cantidad: number = formData.cantidad;

  const itemData = extractData(producto);
  itemData.producto.existencia = producto.existencia;

  const item: PedidoDet = {
    ...formData,
    ...itemData,
    cantidad,
    kilos: calcularKilos(cantidad, producto),
    precioOriginal:
      tipo === TipoDePedido.CREDITO
        ? producto.precioCredito
        : producto.precioContado,
  };

  if (corte.tantos > 0) {
    if (corte.instruccion !== 'ESPECIAL') {
      corte.instruccionEspecial = null;
    }
    item.corte = corte;
    item.importeCortes = round(corte.cantidad * corte.precio, 2);
  } else {
    item.corte = null;
    item.importeCortes = 0.0;
  }
  return item;
}

export function calcularImportes(
  producto: Producto,
  cantidad: number,
  tipo: TipoDePedido
): PedidoSummary {
  if (!producto) {
    return {
      importe: 0,
      descuento: 0,
      descuentoImporte: 0,
      subtotal: 0,
      impuesto: 0,
      total: 0,
      kilos: 0.0,
    };
  }
  const descuento = 0.0;
  const descuentoEspecial = 0.0;
  const { precioCredito, precioContado, unidad, modoVenta } = producto;
  const factor = unidad === 'MIL' ? 1 / 1000 : 1;
  const precio = tipo === TipoDePedido.CREDITO ? precioCredito : precioContado;
  const importe = round(cantidad * factor * precio);
  const descuentoFinal =
    modoVenta === 'N'
      ? 0.0
      : descuentoEspecial > 0
      ? descuentoEspecial
      : descuento;
  const descuentoImporte = round(importe * (descuentoFinal / 100), 2);
  const subtotal = importe - descuentoImporte;
  const impuesto = round(subtotal * 0.16, 2);
  const total = subtotal + impuesto;
  const kilos = calcularKilos(cantidad, producto);
  return {
    importe: importe,
    descuento,
    descuentoImporte,
    subtotal,
    impuesto,
    total,
    kilos,
  };
}
