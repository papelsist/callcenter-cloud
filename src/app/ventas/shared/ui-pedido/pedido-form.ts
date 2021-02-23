import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FormaDePago, TipoDePedido } from '@papx/models';
import { createEnvioForm } from './create-form/pedido-form-factory';
import { CreditoValidators, PedidoValidators } from './validation';

export class PedidoForm extends FormGroup {
  constructor(fb: FormBuilder) {
    super(
      {
        cliente: new FormControl(null, Validators.required),
        sucursal: new FormControl(
          { id: '402880fc5e4ec411015e4ec64e70012e' },
          Validators.required
        ),
        formaDePago: new FormControl(FormaDePago.EFECTIVO, Validators.required),
        tipo: new FormControl(TipoDePedido.CONTADO, Validators.required),
        moneda: new FormControl(
          { value: 'MXN', disabled: true },
          Validators.required
        ),
        comprador: new FormControl(null, Validators.maxLength(50)),
        comentario: new FormControl(null, Validators.maxLength(250)),
        descuentoEspecial: new FormControl(null),
        usoDeCfdi: new FormControl('G01', Validators.required),
        cfdiMail: new FormControl(null),
        envio: createEnvioForm(fb),
        total: new FormControl(0.0, Validators.required),
        corteImporte: new FormControl(null),
      },
      {
        validators: [
          PedidoValidators.ImporteMinimo,
          PedidoValidators.ImporteMaximo,
          PedidoValidators.FormaDePagoCod,
          PedidoValidators.ChequeNoPermitido,
          PedidoValidators.EnJuridico,
          PedidoValidators.ChequesDevueltos,
          PedidoValidators.SocioRequerido,
          PedidoValidators.EnvioRequerido,
          CreditoValidators.CreditoRequired,
          CreditoValidators.ValidarPostFechado,
        ],
      }
    );
  }
}
