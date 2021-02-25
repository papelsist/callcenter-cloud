import { Cliente, ClienteCredito } from './cliente';
import { Direccion } from './direccion';
import { FormaDePago } from './formaDePago';
import { Producto } from './producto';
import { Sucursal } from './sucursal';
import { Transporte } from './transporte';
import firebase from 'firebase/app';

export interface Pedido {
  id?: string;
  fecha: string;
  sucursal: string;
  sucursalId?: string;
  folio?: number;
  cliente: Partial<Cliente>;
  nombre: string;
  rfc: string;
  socio?: any; // Solo para los clientes de la union
  tipo: TipoDePedido;
  formaDePago: FormaDePago;
  moneda: 'MXN' | 'USD' | 'EUR';
  tipoDeCambio: number;
  partidas: Partial<PedidoDet>[];
  // Importes
  importe: number;
  descuento: number;
  descuentoImporte: number;
  subtotal: number;
  impuesto: number;
  total: number;
  descuentoOriginal?: number;
  descuentoEspecial?: number;
  cargosPorManiobra?: number;
  comisionTarjeta?: number;
  comisionTarjetaImporte?: number;
  corteImporte?: number;
  // Otros
  kilos: number;
  comprador?: string;
  comentario?: string;
  envio?: InstruccionDeEnvio;
  cfdiMail?: string;
  usoDeCfdi: string;
  sinExistencia?: boolean;
  chequePostFechado?: boolean;
  status: 'COTIZACION' | 'CERRADO';
  // Log
  inicio?: string;
  dateCreated?: firebase.firestore.Timestamp;
  lastUpdated?: firebase.firestore.Timestamp;
  createUser?: string;
  updateUser?: string;
  autorizacion?: PedidoAutorizacion;
  autorizacionesRequeridas?: string;
  facturaSerie?: string;
  facturaFolio?: string;
  uuid?: string;
  validoHasta?: string;
  createLog?: any;
  updateLog?: any;
  cerrado?: firebase.firestore.Timestamp;
  appVersion?: number;
  vigencia?: string;
}

export interface PedidoDet {
  id?: string;
  clave: string;
  descripcion: string;
  producto: Partial<Producto>;
  productoId: string;
  unidad: string;
  presentacion?: string;
  gramos: number;
  nacional: boolean;
  modoVenta: 'B' | 'N';
  // Importes
  cantidad: number;
  precio: number;
  importe: number;
  descuento: number; // %
  descuentoImporte: number;
  subtotal: number;
  impuesto: number;
  impuestoTasa: number;
  total: number;
  kilos: number;
  // Valores historicos
  precioOriginal?: number;
  precioLista?: number;
  descuentoOriginal?: number; // % Calculado por el sistema
  descuentoEspecial?: number;
  importeCortes?: number;
  faltante?: number;

  corte?: Partial<Corte>;
  comentario?: string;
  // Bitacora
  dateCreated?: string;
  lastUpdated?: string;
  createUser?: string;
  updateUser?: string;
}

export interface Corte {
  tantos: number;
  instruccion: string;
  instruccionEspecial?: string;
  cantidad: number;
  precio: number;
  importe: number;
  limpio: boolean;
  refinado: boolean;
}

export enum TipoDePedido {
  CONTADO = 'CON',
  CREDITO = 'CRE',
  COD = 'COD',
  POST_FECHADO = 'PSF',
  INE = 'INE',
}

// export enum FormaDePago {
//   EFECTIVO = 'EFECTIVO',
//   TRANSFERENCIA = 'TRANSFERENCIA',
//   DEPOSITO_EFECTIVO = 'DEPOSITO_EFECTIVO',
//   DEPOSITO_CHEQUE = 'DEPOSITO_CHEQUE',
//   DEPOSITO_MIXTO = 'DEPOSITO_MIXTO',
//   TARJETA_CRE = 'TARJETA_CREDITO',
//   TARJETA_DEB = 'TARJETA_DEBITO',
//   CHEQUE = 'CHEQUE',
//   CHEQUE_PSTF = 'CHEQUE_PSTF',
//   NO_DEFINIDO = 'NO_DEFINIDO',
// }

export interface InstruccionDeEnvio {
  tipo: 'ENVIO' | 'FORANEO' | 'OCURRE' | 'ENVIO_CARGO';
  direccion: Direccion;
  transporte?: Partial<Transporte>;
  telefono: string;
  contacto: string;
  horario: string;
  comentario: string;
  fechaDeEntrega?: string;
  sucursal?: string;
}

// export enum TipoDeEnvio {
//   Envio = 'ENVIO',
//   Foraneo = 'FORANEO',
//   Ocurre = 'OCURRE',
//   EnvioCarto = 'ENVIO_CARGO'
// }

export interface PedidoAutorizacion {
  sucursal: string;
  tags: string;
  comentario?: string;
  solicita: string;
  autoriza: string;
  dateCreated: string;
}

export class PedidoLog {
  // Datos generales
  id: string;
  folio: number;
  nombre: string;
  fecha: string;
  sucursal: string;
  envio: boolean;
  status: string;

  // Inicio
  inicio: string;
  dateCreated: string;
  lastUpdated: string;
  createUser: string;
  updateUser: string;

  // Cierre
  cerrado?: string;
  cerradoUser?: string;

  //Atención en sucursal
  atiende?: string;
  facturable?: string;
  facturacion?: FacturacionLog;

  // Embarque
  embarqueLog?: EmbarqueLog;
}

export interface FacturacionLog {
  serie: string;
  folio: string;

  creado: string;
  cancelado?: string;
  canceladoComentario?: string;
}

export interface EmbarqueLog {
  embarque: number;
  chofer: string;
  asignado?: Date;
  salida?: Date;
  recepcion?: RecepcionDeEnvio;
}

export interface RecepcionDeEnvio {
  arribo: Date;
  recepcion: Date;
  recibio?: string;
  comentario?: string;
}

export interface PedidoSummary {
  importe: number;
  descuento: number;
  descuentoImporte: number;
  subtotal: number;
  impuesto: number;
  total: number;
  kilos?: number;
  descuentoPorVolumen?: number;
}

/**
 * Parametros basicos para calcular importes y condiciones de un pedido
 *
 */
export interface PedidoParams {
  tipo: TipoDePedido;
  formaDePago: FormaDePago;
  cliente: Cliente;
  credito?: ClienteCredito;
  descuentoEspecial?: number;
  partidas: PedidoDet[];
}

/**
 * Parametros normalmente requeridos para la
 * altas, bajas y cambios de un PedidoDet
 */
export interface PedidoItemParams {
  tipo: TipoDePedido;
  // formaDePago: FormaDePago;
  sucursal?: string;
  descuento: number;
  descuentoEspecial?: number;
}
/*
export interface PedidoItemParams {
  tipo: TipoDePedido;
  formaDePago: FormaDePago;
  clienteCredito?: ClienteCredito; // Cuando hay descuento fijo
  descuento: number;
  descuentoEspecial?: number;
  sucursal?: string;
}
*/
