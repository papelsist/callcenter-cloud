import { Autorizacion, AutorizacionRechazo } from './autorizacion';
import { Banco } from './banco';
import { Cliente } from './cliente';
import { CuentaDeBanco } from './cuenta-de-banco';
import { Pedido } from './pedidos-model';

import { User } from './user';

export interface SolicitudDeDeposito {
  id: string;
  folio: number;
  sucursal: string;
  sucursalId: string;
  tipo: 'CRE' | 'CHE' | 'JUR' | 'CHO' | 'CON';
  callcenter?: boolean;
  fecha: string;
  cliente: Partial<Cliente>;
  banco: Partial<Banco>;
  cuenta: Partial<CuentaDeBanco>;
  solicita: string;
  fechaDeposito: string;
  referencia: string;
  transferencia: number;
  efectivo: number;
  cheque: number;
  sbc: boolean;
  total: number;
  dateCreated?: string;
  lastUpdated?: string;
  createUser: Partial<User>;
  updateUser: Partial<User>;
  uid: string;
  autorizacion?: Autorizacion;
  rechazo?: AutorizacionRechazo;
  rechasosAnteriores?: AutorizacionRechazo[];
  status: 'PENDIENTE' | 'AUTORIZADO' | 'RECHAZADO';
  retraso?: number;
  pedidos?: Partial<Pedido>[];
  appVersion?: number;
}

export interface UpdateSolicitud {
  id: string;
  changes: Partial<SolicitudDeDeposito>;
}
