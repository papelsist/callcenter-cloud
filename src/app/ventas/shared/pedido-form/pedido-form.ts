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
        nombre: new FormControl(null, [
          Validators.required,
          Validators.minLength(5),
        ]),
        sucursal: new FormControl(null, Validators.required),
        sucursalId: new FormControl(null),
        socio: new FormControl(null),
        sucursalEntity: new FormControl(null, Validators.required),
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
        importe: new FormControl(0.0, Validators.required),
        descuento: new FormControl(0.0, Validators.required),
        descuentoImporte: new FormControl(0.0, Validators.required),
        subtotal: new FormControl(0.0, Validators.required),
        impuesto: new FormControl(0.0, Validators.required),
        total: new FormControl(0.0, Validators.required),
        kilos: new FormControl(0.0),
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
