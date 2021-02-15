import { Direccion } from './direccion';

export interface Transporte {
  id?: string;
  nombre: string;
  direccion: Direccion;
}
