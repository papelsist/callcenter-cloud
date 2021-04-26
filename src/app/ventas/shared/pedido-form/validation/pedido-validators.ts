import {
  FormGroup,
  ValidatorFn,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { Cliente, FormaDePago, TipoDePedido } from '@papx/models';

import isEmpty from 'lodash-es/isEmpty';

export class PedidoValidators {
  static ImporteMinimo(formGroup: FormGroup): ValidationErrors | null {
    const total: number = formGroup.get('total').value;
    const res = total < 10 ? { importeMinimo: true } : null;
    return total < 10 ? { importeMinimo: true } : null;
  }

  static ImporteMaximo(formGroup: FormGroup): ValidationErrors | null {
    const total: number = formGroup.get('total').value;
    const fpago: string = formGroup.get('formaDePago').value;
    const tipo = formGroup.get('tipo').value;
    if (tipo === TipoDePedido.CREDITO) {
      return null;
    }
    if (fpago !== FormaDePago.EFECTIVO) {
      return null;
    }
    const maximo = 100000.0;
    return total > maximo ? { importeMaximo: true } : null;
  }

  /**
   * Valida la fomra de pedido en COD
   *
   * @param formGroup Pedido main Form
   */
  static FormaDePagoCod(formGroup: FormGroup): ValidationErrors | null {
    const tipo = formGroup.get('tipo').value;
    if (tipo !== TipoDePedido.COD) {
      // Criterio aplica solo a ventas COD
      return null;
    }
    const formaDePago = formGroup.get('formaDePago').value;
    const valido =
      formaDePago === FormaDePago.CHEQUE ||
      formaDePago === FormaDePago.EFECTIVO ||
      formaDePago === FormaDePago.TARJETA_CRE ||
      formaDePago === FormaDePago.TARJETA_DEB;
    return !valido ? { formaDePagoInvalidaEnCod: true } : null;
  }

  static ChequeNoPermitido(formGroup: FormGroup): ValidationErrors | null {
    const value = formGroup.value;
    const cliente: Cliente = value.cliente;
    const cheque = value.formaDePago === FormaDePago.CHEQUE;
    return cheque
      ? !cliente.permiteCheque
        ? { chequeNoPermitido: true }
        : null
      : null;
  }

  static EnJuridico(form: FormGroup): ValidationErrors | null {
    const cliente: Cliente = form.value.cliente;
    return cliente ? (cliente.juridico ? { enJuridico: true } : null) : null;
  }

  static ChequesDevueltos(form: FormGroup): ValidationErrors | null {
    const cliente: Cliente = form.value.cliente;
    return cliente
      ? cliente.chequeDevuelto > 0
        ? { chequesDevueltos: true }
        : null
      : null;
  }

  static SocioRequerido(form: FormGroup): ValidationErrors | null {
    const cliente: Cliente = form.value.cliente;
    const union = cliente ? cliente.clave === 'U050008' : false;
    const socio = form.value.socio;
    return union ? (isEmpty(socio) ? { socioRequerido: true } : null) : null;
  }

  static EnvioRequerido(form: FormGroup): ValidationErrors | null {
    const cod = form.value.tipo === TipoDePedido.COD;
    if (!cod) return null; // Solo COD
    const envio = form.get('envio');
    return cod ? (envio.invalid ? { envioRequerido: true } : null) : null;
  }
}
