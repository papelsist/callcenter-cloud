import { Direccion } from './direccion';
import { FormaDePago } from './formaDePago';

export interface Cliente {
  id: string;
  nombre: string;
  clave: string;
  rfc: string;
  formaDePago?: string | number | FormaDePago;
  cfdiMail?: string;
  email?: string;
  credito?: ClienteCredito;
  permiteCheque: boolean;
  folioRFC: number;
  chequeDevuelto: number;
  activo: true;
  juridico: boolean;
  medios?: Partial<MedioDeContacto[]>;
  direccion: Direccion;
  direcciones?: ClienteDireccion[];
  direccionesEntrega?: ClienteDireccion[];
  dateCreated?: string;
  lastUpdated?: string;
  telefonos?: string[];
  createUser?: string;
  updateUser?: string;
  socios?: Partial<Socio>[];
}

export interface ClienteCredito {
  id: string;
  cliente: Partial<Cliente>;
  creditoActivo: boolean;
  lineaDeCredito: number;
  descuentoFijo: number;
  plazo: number;
  venceFactura: boolean;
  revision: boolean;
  diaRevision: number;
  diaCobro: number;
  postfechado: boolean;
  saldo: number;
  atrasoMaximo: number;
  operador: number;
  cobrador?: { id: string };
  socio?: Partial<Socio>;
  usoDeCfdi?: string;
  createUser?: string;
  updateUser?: string;
  dateCreated?: string;
  lastUpdated?: string;
}

export interface ClienteDireccion {
  id?: string;
  nombre: string;
  direccion: Direccion;
  cliente?: Partial<Cliente>;
}

export interface MedioDeContacto {
  id?: string;
  tipo: 'TEL' | 'CEL' | 'FAX' | 'MAIL' | 'WEB';
  descripcion: string;
  cfdi?: boolean;
  cliente: Partial<Cliente>;
  activo: boolean;
  validado?: boolean;
  createUser?: string;
  updateUser?: string;
}

export interface Socio {
  id: string;
  clave?: string;
  nombre: string;
  direccion?: string;
  direccionFiscal: Direccion;
}
