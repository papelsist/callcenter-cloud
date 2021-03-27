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

export function getFormValidationErrors(form: FormGroup): any[] {
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
