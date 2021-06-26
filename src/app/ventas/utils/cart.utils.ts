import {
  PedidoDet,
  TipoDePedido,
  Pedido,
  Cliente,
  Producto,
  FormaDePago,
  PedidoSummary,
} from '@papx/models';

import { generarCargoPorCorte, generarCargoPorTarjeta } from './cargos';

import round from 'lodash-es/round';
import sumBy from 'lodash-es/sumBy';
import maxBy from 'lodash-es/maxBy';

/**
 * AL 10 Febrero 2021
 * 0.00	100.00
 * 10.00	1000.00
 * 11.00	5000.00
 * 13.00	12000.00
 * 14.00	21500.00
 * 15.00	46000.00
 * 16.00	82000.00
 * 17.00	150000.00
 * 18.00	30000000.00
 */

export const DESCUENTOS = [
  { descuento: 0.0, importe: 100.0 },
  { descuento: 10.0, importe: 1000.0 },
  { descuento: 11.0, importe: 5000.0 },
  { descuento: 13.0, importe: 12000.0 },
  { descuento: 14.0, importe: 21500.0 },
  { descuento: 15.0, importe: 46000.0 },
  { descuento: 16.0, importe: 82000.0 },
  { descuento: 17.0, importe: 150000.0 },
  { descuento: 18.0, importe: 30000000.0 },
];

export function calcularImporteBruto(partidas: PedidoDet[]): number {
  const items = normalize(partidas);
  const importe = sumBy(items, (i: PedidoDet) => {
    if (i.producto.modoVenta === 'B') {
      const { cantidad, precio } = i;
      const factor = i.unidad === 'MIL' ? 1000 : 1;
      const res = (cantidad * precio) / factor;
      return round(res, 2);
    } else {
      return 0.0;
    }
  });
  return importe;
}

export function findDescuentoPorVolumen(
  importe: number,
  descuentos = DESCUENTOS
) {
  const mayores = descuentos.filter((item) => item.importe >= importe);
  if (mayores.length > 0) {
    return mayores[0].descuento;
  } else {
    return 18.0;
  }
}
/**
 * Pure function para calcular el descuento del Pedido en funcion de las partidas, el tipo de venta
 * y el cliente
 *
 * @param items
 * @param tipo
 * @param cliente
 */
export function calcularDescuento(
  items: PedidoDet[],
  tipo: TipoDePedido,
  cliente: Partial<Cliente>
): number {
  switch (tipo) {
    case TipoDePedido.CREDITO: {
      if (cliente.credito && cliente.credito.postfechado) {
        const importe = calcularImporteBruto(items);
        return findDescuentoPorVolumen(importe) - 4;
      } else {
        return cliente.credito ? cliente.credito.descuentoFijo || 0.0 : 0.0;
      }
    }
    case TipoDePedido.INE:
    case TipoDePedido.CONTADO:
    case TipoDePedido.COD: {
      const importe = calcularImporteBruto(items);
      return findDescuentoPorVolumen(importe);
    }
    default: {
      console.log('Tipo de venta no califica para descuento tipo: ', tipo);
      return 0;
    }
  }
}

/**
 * Pure function para aplica el descuento a las partidas del ShoppingCart
 *
 * @param partidas
 * @param tipo
 * @param cliente
 */
export function recalcularPartidas(
  partidas: PedidoDet[],
  tipo: TipoDePedido,
  fpago: FormaDePago,
  cliente: Partial<Cliente>,
  descuentoEspecial: number = 0.0
): PedidoDet[] {
  const items = filtrarPartidasAutomaticas(partidas);
  let descuento = calcularDescuento(items, tipo, cliente);
  const descuentoOriginal = descuento;
  // let descuentoEspecial = 0.0;

  console.groupCollapsed('Recalculando partidas');
  console.log('Descuento calculado: ', descuento);
  console.log('Descuento especial: ', descuentoEspecial);
  console.log('Descuento original: ', descuentoOriginal);

  if (tipo === TipoDePedido.CREDITO) {
    descuentoEspecial = 0;
  }

  if (descuentoEspecial > 0) {
    descuento = descuentoEspecial;
  } else {
    if (fpago === FormaDePago.TARJETA_CRE && descuento > 2) {
      descuento = descuento - 2;
    }
    if (fpago === FormaDePago.TARJETA_DEB && descuento > 1) {
      descuento = descuento - 1;
    }
  }

  console.log('Dscto aplicado: ', descuento);

  const res: PedidoDet[] = [];
  items.map((item) => {
    let rdesc: number;
    if (tipo === TipoDePedido.CREDITO) {
      rdesc = descuento;
    } else {
      if (item.modoVenta === 'B') {
        rdesc = descuento;
        // descuentoEspecial = 0;
      } else {
        rdesc = 0;
        descuentoEspecial = 0;
      }
    }
    const det: PedidoDet = actualizarImportes(item, tipo, rdesc);
    det.descuentoOriginal = descuentoOriginal;
    det.descuentoEspecial = descuentoEspecial > 0 ? descuentoEspecial : 0;

    console.log(
      'Importe: %f Descto:%f Subtotal: %f Iva:%f Total:%f',
      det.importe,
      det.descuentoImporte,
      det.subtotal,
      det.impuesto,
      det.total
    );
    res.push(det);
  });
  console.groupEnd();
  return res;
}

export function actualizarImportes(
  item: PedidoDet,
  tipo: TipoDePedido,
  descuento: number
): PedidoDet {
  const { cantidad } = item;
  const { precioCredito, precioContado } = item.producto;
  const factor = item.unidad === 'MIL' ? 1000 : 1;
  const precio = tipo === TipoDePedido.CREDITO ? precioCredito : precioContado;
  let importe = (cantidad * precio) / factor;
  importe = round(importe, 2);
  const descuentoImporte = round(importe * (descuento / 100), 2);
  const subtotal = importe - descuentoImporte;
  const impuesto = round(subtotal * 0.16, 2);
  const total = subtotal + impuesto;
  return {
    ...item,
    precio,
    precioLista: precio,
    importe,
    descuento,
    descuentoOriginal: descuento,
    descuentoImporte,
    subtotal,
    impuesto,
    total,
  };
}

/**
 * Build the ShoppingCart sumary out of their items
 *
 * @param items PedidoDet array
 */
export function buildSummary(items: PedidoDet[]): PedidoSummary {
  const importe = round(sumBy(items, 'importe'), 2);
  const descuentoImporte = round(sumBy(items, 'descuentoImporte'), 2);
  const subtotal = round(sumBy(items, 'subtotal'), 2);
  const impuesto = round(sumBy(items, 'impuesto'), 2);
  const total = round(sumBy(items, 'total'), 2);
  const maxDes = maxBy(items, 'descuento');
  const descuento = maxDes ? maxDes.descuento : 0.0;
  const maxDesOriginal = maxBy(items, 'descuentoOriginal');
  const descuentoOriginal = maxDesOriginal
    ? maxDesOriginal.descuentoOriginal
    : 0.0;
  const kilos = sumBy(items, 'kilos');
  return {
    importe,
    descuentoImporte,
    subtotal,
    impuesto,
    total,
    descuento,
    descuentoOriginal,
    kilos,
  };
}

/**
 * Filtra las partidas quitando las que no participan para acumular descuentos
 * ni les corresponde descuento alguno es dedicr CORTE, MANIOBRA y MANIOBRAF
 *
 * @param partidas
 */
export function normalize(partidas: PedidoDet[]) {
  return partidas
    .filter((item) => !item.clave.includes('CORTE'))
    .filter((item) => !item.clave.startsWith('MANIOBRA'));
}

/**
 * Quita las partidas de CORTE y MANIOBRA dejando la de MANIOBRAF
 *
 * @param partidas
 */
export function filtrarPartidasAutomaticas(partidas: PedidoDet[]) {
  return partidas
    .filter((item) => !item.clave.includes('CORTE'))
    .filter((item) => item.clave !== 'MANIOBRA');
}
