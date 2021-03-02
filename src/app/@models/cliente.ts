import { Direccion } from './direccion';
import { FormaDePago } from './formaDePago';

export interface Cliente {
  id: string;
  nombre: string;
  clave: string;
  rfc: string;
  formaDePago?: string | number | FormaDePago;
  cfdiMail?: string;
  credito?: ClienteCredito;
  permiteCheque: boolean;
  folioRFC: number;
  chequeDevuelto: number;
  activo: boolean;
  juridico: boolean;
  medios?: Partial<MedioDeContacto[]>;
  contactos?: ClienteContactos[];
  direccion: Direccion;
  direcciones?: ClienteDireccion[];
  dateCreated?: string;
  lastUpdated?: string;
  telefonos?: string[];
  correos?: [];
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
  nombre: string;
  direccion: Direccion;
  contacto?: string;
  telefono?: string;
  email?: string;
  horario?: { horaInicial: '08:00'; horaFinal: '19:00' };
  cliente?: Partial<Cliente>;
  notificacion?: 'email' | 'sms';
}
export interface ClienteContactos {
  id: string;
  nombre: string;
  email?: string;
  cel?: string;
  cargo: string;
  clienteId: string;
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
