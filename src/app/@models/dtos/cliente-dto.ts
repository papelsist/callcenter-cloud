import { ClienteCredito } from '../cliente';

export interface ClienteDto {
  id: string;
  nombre: string;
  rfc: string;
  clave?: string;
  credito?: boolean;
}
