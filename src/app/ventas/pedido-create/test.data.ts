import { Cliente, FormaDePago, Pedido, TipoDePedido } from '@papx/models';

export const demoPedidoCre = () => {
  return {
    cliente: getCliente(),
    sucursal: {
      id: '402880fc5e4ec411015e4ec64e70012e',
      clave: '12',
      nombre: 'TACUBA',
    },
    tipo: TipoDePedido.CREDITO,
    formaDePago: FormaDePago.NO_DEFINIDO,
    moneda: 'MXN',
  };
};

export function buildDummyPedido(): Pedido {
  const cliente = getCliente();
  const { nombre, rfc } = cliente;
  return {
    folio: 0,
    fecha: new Date().toISOString(),
    sucursal: {
      id: '402880fc5e4ec411015e4ec64e70012e',
      clave: '12',
      nombre: 'TACUBA',
    },
    moneda: 'MXN',
    tipoDeCambio: 1.0,
    cliente,
    nombre,
    rfc,
    tipo: TipoDePedido.CREDITO,
    formaDePago: FormaDePago.NO_DEFINIDO,
    envio: null,
    comprador: null,
    partidas: [],
    importe: 0.0,
    descuento: 0.0,
    descuentoEspecial: 0.0,
    descuentoImporte: 0.0,
    subtotal: 0,
    impuesto: 0,
    total: 0,
    kilos: 0.0,
    status: 'COTIZACION',
    usoDeCfdi: '03',
  };
}

export function getCliente(): Cliente {
  return {
    id: '402880fc5e4ec411015e4ec7a46701de',
    dateCreated: '2017-09-16T18:24:20Z',
    permiteCheque: true,
    formaDePago: 3,
    clave: 'P010389',
    lastUpdated: '2020-10-04T14:42:35Z',
    rfc: 'PBA0511077F9',
    folioRFC: 1,
    chequeDevuelto: 0.0,
    updateUser: 'gontiverosc',
    activo: true,
    juridico: false,
    nombre: 'PAPELSA BAJIO SA DE CV',
    email: 'gbarron@papelsa.com.mx',
    createUser: 'gontiverosc',
    credito: {
      id: '402880fc5e528d79015e52a2d9d046b0',
      postfechado: false,
      operador: 3,
      lastUpdated: '2020-10-07T11:57:12Z',
      saldo: 19684733.58,
      lineaDeCredito: 30000000.0,
      plazo: 60,
      updateUser: 'gontiverosc',
      atrasoMaximo: 0,
      cobrador: {
        id: '402880fc5e4ec411015e4ec6636b015a',
      },
      creditoActivo: false,
      diaRevision: 1,

      diaCobro: 1,
      revision: false,
      venceFactura: true,
      cliente: {
        id: '402880fc5e4ec411015e4ec7a46701de',
      },
      descuentoFijo: 25.3,
      createUser: 'gontiverosc',
    },
    direccion: {
      calle: 'GRACIANO SANCHEZ',
      codigoPostal: '76030',
      colonia: 'CASA BLANCA',
      estado: 'QUER\u00c9TARO',
      latitud: 0.0,
      longitud: 0.0,
      municipio: 'QUERETARO',
      numeroExterior: '3',
      pais: 'M\u00e9xico',
    },
    telefonos: ['442-215-4510', '442-215-4511', '01442-215-4512'],
    cfdiMail: 'gbarron@papelsa.com.mx',
    medios: [
      {
        id: '402880fc609e502601609e5925d60135',
        updateUser: 'gontiverosc',
        tipo: 'TEL',
        activo: true,
        descripcion: '01442-215-4512',
        cliente: {
          id: '402880fc5e4ec411015e4ec7a46701de',
        },
        createUser: 'gontiverosc',
        cfdi: false,
      },
      {
        id: '402880fc609e502601609e5924900132',
        tipo: 'FAX',
        activo: true,
        descripcion: '01442-215-4513',
        cliente: {
          id: '402880fc5e4ec411015e4ec7a46701de',
        },
        cfdi: false,
      },
      {
        id: '402880fc609e502601609e59256a0134',
        updateUser: 'gontiverosc',
        tipo: 'TEL',
        activo: true,
        descripcion: '442-215-4511',
        cliente: {
          id: '402880fc5e4ec411015e4ec7a46701de',
        },
        createUser: 'gontiverosc',
        cfdi: false,
      },
      {
        id: '402880fc609e502601609e5926410136',
        tipo: 'MAIL',
        activo: true,
        descripcion: 'gbarron@papelsa.com.mx',
        validado: true,
        cliente: {
          id: '402880fc5e4ec411015e4ec7a46701de',
        },
        cfdi: true,
      },
      {
        id: '402880fc609e502601609e5924fe0133',
        updateUser: 'gontiverosc',
        tipo: 'TEL',
        activo: true,
        descripcion: '442-215-4510',
        cliente: {
          id: '402880fc5e4ec411015e4ec7a46701de',
        },
        createUser: 'gontiverosc',
        cfdi: false,
      },
    ],
  };
}
