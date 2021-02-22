import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { createEnvioForm } from './create-form/pedido-form-factory';

export class PedidoForm extends FormGroup {
  constructor(fb: FormBuilder) {
    super({
      cliente: new FormControl(null, Validators.required),
      sucursal: new FormControl(null, Validators.required),
      formaDePago: new FormControl(null, Validators.required),
      tipo: new FormControl(null, Validators.required),
      moneda: new FormControl(
        { value: 'MXN', disabled: true },
        Validators.required
      ),
      comprador: new FormControl(null, Validators.maxLength(50)),
      comentario: new FormControl(null, Validators.maxLength(250)),
      descuentoEspecial: new FormControl(null),
      usoDeCfdi: new FormControl('G01', Validators.required),
      cfdiMail: new FormControl(null, Validators.email),
      envio: createEnvioForm(fb),
      corteImporte: new FormControl(null),
    });
  }
}
