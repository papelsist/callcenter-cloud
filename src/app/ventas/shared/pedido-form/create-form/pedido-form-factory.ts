import {
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';

// export function direccionValidator(control: AbstractControl) {
//   const form = control.parent;
//   const tipo = form.controls['tipo'].value;
//   const direccion = control.value;
//   if (tipo === 'OCURRE') {
//     return null;
//   } else {
//     return direccion === null ? { required: true } : null;
//   }
// }
// export function direccionValidator(): ValidatorFn {
//   return (form: FormGroup) => {
//     const tipo = form.controls['tipo'].value;
//     const direccion = form.controls['direccion'].value;
//     if(tipo === 'OCURRE') {
//       return null;
//     } else {
//       return (direccion === null ) ? {required: true} : null;
//     }
//   }
// }

export function createEnvioForm(fb: FormBuilder) {
  return fb.group(
    {
      tipo: ['ENVIO', [Validators.required]],
      transporte: [{ value: null, disabled: true }],
      contacto: [
        null,
        {
          validators: [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
          ],
          updateOn: 'blur', // Required to capitalize de value
        },
      ],
      telefono: [
        null,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      horario: [
        { horaInicial: '08:00', horaFinal: '19:00' },
        [Validators.required],
      ],
      comentario: [],
      fechaDeEntrega: [new Date().toISOString()],
      direccion: [{ value: null, disabled: true }, [Validators.required]],
    },
    { updateOn: 'change' }
  );
}
