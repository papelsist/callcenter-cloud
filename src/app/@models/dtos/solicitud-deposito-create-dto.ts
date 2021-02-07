export interface SolicitudDeDepositoCreateDto {
  cliente: string;
  nombre: string;
  transferencia: number;
  efectivo: number;
  cheque: number;
  fecha: Date | string;
}
