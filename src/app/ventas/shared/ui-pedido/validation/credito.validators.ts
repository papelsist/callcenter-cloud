import { FormGroup, ValidationErrors } from '@angular/forms';

import { Cliente, FormaDePago, TipoDePedido } from '@papx/models';

export const ErrorKeys = { CeditoRequerido: 'creditoRequerido' };

/**
 * Validators para ventas de credito
 */
export class CreditoValidators {
  /**
   * En ventas tipo CRE el ClienteCredito es requerido
   */
  static CreditoRequired(formGroup: FormGroup): ValidationErrors | null {
    const tipo: TipoDePedido = formGroup.get('tipo').value;

    if (tipo !== TipoDePedido.CREDITO) {
      return null;
      // don't validate other than CREDITO
    }

    const cliente: Cliente = formGroup.get('cliente').value;

    if (!cliente) {
      return null;
    }
    const credito = cliente.credito;
    return !credito ? { creditoRequerido: true } : null;
  }

  static ValidarPostFechado(formGroup: FormGroup): ValidationErrors | null {
    const formaDePago = formGroup.get('formaDePago').value;
    if (formaDePago === FormaDePago.CHEQUE_PSTF) {
      const cliente = formGroup.get('cliente').value;
      const credito = cliente.credito;
      if (!credito || !credito.postfechado) {
        return { postfechadoNoPermitido: true };
      }
      const tipo = formGroup.get('tipo').value;
      if (tipo !== TipoDePedido.CREDITO) {
        return { postfechadoRequiereCredito: true };
      }
    }
  }
}
