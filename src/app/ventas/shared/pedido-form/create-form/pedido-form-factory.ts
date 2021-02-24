import { FormBuilder, Validators } from '@angular/forms';

export function createEnvioForm(fb: FormBuilder) {
  return fb.group(
    {
      tipo: ['ENVIO', [Validators.required]],
      transporte: [{ value: null, disabled: false }],
      contacto: [
        null,
        {
          validators: [
            Validators.required,
            Validators.minLength(5),
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
      direccion: [{ value: null, disabled: true }],
    },
    { updateOn: 'change' }
  );
}
