import { Cliente } from '../cliente';

export interface PedidoCreateDto {
  cliente: Partial<Cliente>;
  comentario: string;
}
