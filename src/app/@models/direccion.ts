export interface Direccion {
  calle: string;
  numeroExterior: string;
  numeroInterior?: string;
  codigoPostal: string;
  colonia: string;
  municipio?: string;
  estado: string;
  pais: 'MEXICO' | 'Mexico' | 'México' | 'ESTADOS UNIDOS' | 'CANADA';
  latitud?: number;
  longitud?: number;
}

export function buildDireccionKey(direccion: Direccion) {
  return `${direccion.calle.substring(0, 20)} #${direccion.numeroExterior} CP:${
    direccion.codigoPostal
  }`;
}
