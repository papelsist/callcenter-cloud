import { FormGroup, ValidatorFn } from '@angular/forms';

export namespace ItemValitators {
  export const corteValidator: ValidatorFn = (corteForm: FormGroup) => {
    const tantos = corteForm.get('tantos').value;
    if (tantos > 0) {
      const {
        instruccion,
        cantidad,
        precio,
        instruccionEspecial,
      } = corteForm.value;
      if (!instruccion) {
        return {
          instruccionRequerida: true,
          message: 'Se requiere la instrucción',
        };
      } else if (instruccion === 'ESPECIAL' && !instruccionEspecial) {
        return {
          instruccionEspecialRequerida: true,
          message: 'Se requiere la descripción del corte especial',
        };
      } else if (cantidad <= 0) {
        return {
          cantidadDeCortesRequerida: true,
          message: 'Se requiere el # de cortes',
        };
      }
    }
    return null;
  };
}
