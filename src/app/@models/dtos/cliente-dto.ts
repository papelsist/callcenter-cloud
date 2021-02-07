import { ClienteCredito } from '../cliente';

export interface ClienteDto {
  id: string;
  nombre: string;
  clave: string;
  rfc: string;
  cfdiMail?: string;
  email?: string;
  credito?: Partial<ClienteCredito>;
  permiteCheque: boolean;
  activo: true;
  lastUpdated?: string;
  updateUser?: string;
}
