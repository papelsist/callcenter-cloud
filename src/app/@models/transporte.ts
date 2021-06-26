import { Direccion } from './direccion';

export interface Transporte {
  id?: string;
  nombre: string;
  sucursal?: string;
  sucurslId?: string;
  telefono1?: string;
  telefono2?: string;
  telefono3?: string;
  direccion: Direccion;
}
