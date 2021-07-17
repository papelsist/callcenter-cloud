// const data = { nombre":"TACUBA","vendedor":"AGUADARRAMA","tipo":"CON","ejercicio":2021,"mes":3,"facturas":1,"total":12575.76,"kilos":409.25}
export interface VentaAcumulada {
  sucursal: string;
  vendedor: string;
  tipo: string;
  ejercicio: number;
  mes: number;
  facturas: number;
  total: number;
  kilos: number;
}
