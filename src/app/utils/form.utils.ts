import {
  FormGroup,
  FormBuilder,
  Validators,
  ValidationErrors,
} from '@angular/forms';

export const buildDireccionForm = (fb: FormBuilder): FormGroup => {
  return fb.group(
    {
      calle: [null, [Validators.required]],
      numeroExterior: [null, [Validators.required]],
      numeroInterior: [null],
      codigoPostal: [
        null,
        { validators: [Validators.required], updateOn: 'blur' },
      ],
      colonia: [null, [Validators.required]],
      municipio: [null],
      estado: [null, [Validators.required]],
      pais: ['MEXICO', [Validators.required]],
    },
    { updateOn: 'blur' }
  );
};

export const getDireccionKey = (dd: any): string => {
  console.log('Generando Direccion key para: ', dd);
  const calle = dd.calle.trim() || '';
  const key = `${calle.substr(0, 10)} #:${dd.numeroExterior || ''} CP:${
    dd.codigoPostal
  }`;
  return key;
};

export function getFormValidationErrors(form: FormGroup) {
  const result = [];
  Object.keys(form.controls).forEach((key) => {
    const controlErrors: ValidationErrors = form.get(key).errors;
    if (controlErrors) {
      Object.keys(controlErrors).forEach((keyError) => {
        result.push({
          control: key,
          error: keyError,
          value: controlErrors[keyError],
        });
      });
    }
  });

  return result;
}
