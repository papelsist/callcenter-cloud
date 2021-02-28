import { Cliente, Pedido, PedidoDet } from '@papx/models';

export function copiarPedido(source: Pedido): Pedido {
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
    fecha: new Date().toISOString(),
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
    permiteCheque: false,
    activo: true,
  };
}
