export interface CuentaDeBanco {
  id: string;
  descripcion: string;
  clave: string;
  numero: string;
  moneda: string;
  banco: string;
  activo?: true;
  tipo?: string;
  disponibleEnVenta?: true;
  dateCreated?: string;
  lastUpdated?: string;
}
