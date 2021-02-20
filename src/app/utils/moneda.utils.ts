import round from 'lodash-es/round';

export function calcularDescuento(importe: number, descuento: number) {
  return round(importe * (descuento / 100), 2);
}

export function aplicarDescuento(importe: number, descuento: number) {
  return round(importe - calcularDescuento(importe, descuento));
}
export function calcularIva(subtotal: number) {
  return round(subtotal * 0.16, 2);
}
