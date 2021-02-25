/**
 * Utility pure functions to help in business rules related to
 * CURD operations en Pedidos entiti
 */

import { Cliente, Pedido, PedidoSummary, Producto } from '@papx/models';

/**
 *
 * @param p
 * @param partidas
 */
export function getPedidoSummary(p: Partial<Pedido>): PedidoSummary {
  return {
    importe: p.importe,
    descuento: p.descuento,
    descuentoImporte: p.descuentoImporte,
    subtotal: p.subtotal,
    impuesto: p.impuesto,
    total: p.total,
    kilos: p.kilos,
    descuentoOriginal: p.descuentoOriginal,
  };
}

export function zeroSummary(): PedidoSummary {
  return {
    importe: 0.0,
    descuento: 0.0,
    descuentoImporte: 0.0,
    subtotal: 0.0,
    impuesto: 0.0,
    total: 0.0,
    kilos: 0,
    descuentoPorVolumen: 0.0,
  };
}

export function reduceCliente(cliente: Partial<Cliente>) {
  const { id, nombre, rfc, clave } = cliente;
  return {
    id,
    nombre,
    rfc,
    clave,
  };
}

/**
 * Extract the basic properties of a product to be
 * pat of a PedidoDet document
 *
 * @param producto
 */
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
