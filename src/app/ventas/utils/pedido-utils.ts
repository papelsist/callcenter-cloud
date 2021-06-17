import { Cliente, Pedido, PedidoDet } from '@papx/models';
import firebase from 'firebase/app';
export function copiarPedido(source: Partial<Pedido>): Pedido {
  const {
    importe,
    descuento,
    descuentoImporte,
    subtotal,
    impuesto,
    total,
    descuentoOriginal,
    descuentoEspecial,
    cargosPorManiobra,
    comisionTarjeta,
    comisionTarjetaImporte,
    corteImporte,
    kilos,
    comprador,
    comentario,
    cfdiMail,
    usoDeCfdi,
    chequePostFechado,
  } = source;
  return {
    appVersion: 2,
    status: 'COTIZACION',
    fecha: firebase.firestore.Timestamp.now(),
    sucursal: source.sucursal,
    sucursalId: source.sucursalId,
    cliente: source.cliente,
    nombre: source.nombre,
    rfc: source.rfc,
    socio: source?.id,
    tipo: source.tipo,
    formaDePago: source.formaDePago,
    moneda: source.moneda,
    tipoDeCambio: source.tipoDeCambio,
    partidas: clonePartidas(source.partidas),
    importe,
    descuento,
    descuentoImporte,
    subtotal,
    impuesto,
    total,
    descuentoOriginal,
    descuentoEspecial,
    cargosPorManiobra,
    comisionTarjeta,
    comisionTarjetaImporte,
    corteImporte,
    kilos,
    comprador,
    comentario,
    cfdiMail,
    usoDeCfdi,
    chequePostFechado,
  };
}

export function clonePartidas(partidas: Partial<PedidoDet>[]) {
  return partidas.map((item) => {
    const {
      id,
      lastUpdated,
      dateCreated,
      updateUser,
      createUser,
      ...res
    } = item;
    return res;
  });
}

export function getClienteMostrador(): Partial<Cliente> {
  return {
    id: '402880fc5e4ec411015e4ecc5dfc0554',
    rfc: 'XAXX010101000',
    nombre: 'MOSTRADOR',
    clave: '1',
    permiteCheque: false,
    activo: true,
  };
}
