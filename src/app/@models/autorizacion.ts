export interface Autorizacion {
  user: string;
  fecha: string;
  tipo: TipoDeAutorizacion;
  autorizo?: string;
  comentario?: string;
}

export type TipoDeAutorizacion =
  | 'TRANSACCION_BANCARIA'
  | 'VENTA_SIN_EXISTENCIA'
  | 'DESCUENTO_ESPECIAL'
  | 'EXISTENCIA_FALTANTE';

export interface AutorizacionRechazo {
  user: string;
  fecha: string;
  tipo: string;
  motivo: string;
  comentario?: string;
}
