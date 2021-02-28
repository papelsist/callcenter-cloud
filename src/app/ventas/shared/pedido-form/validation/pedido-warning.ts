import {
  TipoDePedido,
  Cliente,
  PedidoDet,
  Pedido,
  Warning,
} from '@papx/models';

import sumBy from 'lodash-es/sumBy';
import round from 'lodash-es/round';

export class PedidoWarnings {
  static runWarnings(
    cliente: Partial<Cliente>,
    tipo: TipoDePedido,
    descuentoEspecial = 0,
    items: Partial<PedidoDet>[]
  ) {
    const warnings = [];
    this.ValidarClienteActivo(cliente, warnings);
    this.ValidarCreditoVigente(cliente, tipo, warnings);
    this.ValidarAtrasoMaximo(cliente, tipo, warnings);
    this.ValidarCreditoDisponible(cliente, tipo, items, warnings);
    this.ValidarAutorizacionPorDescuentoEspecial(descuentoEspecial, warnings);
    this.ValidarAutorizacionPorFaltaDeExistencia(items, warnings);

    return warnings;
  }
  static ValidarClienteActivo(cliente: Partial<Cliente>, errors: Warning[]) {
    if (!cliente.activo) {
      errors.push({
        error: 'CLIENTE_ACTIVO',
        descripcion: 'CLIENTE SUSPENDIDO',
      });
    }
  }
  static ValidarCreditoVigente(
    cliente: Partial<Cliente>,
    tipo: TipoDePedido,
    errors: Warning[]
  ) {
    if (tipo === TipoDePedido.CREDITO) {
      if (cliente.credito) {
        if (!cliente.credito.creditoActivo) {
          errors.push({
            error: 'CREDITO_SUSPENDIDO',
            descripcion: 'CREDITO SUSPENDIDO',
          });
        }
      }
    }
  }

  static ValidarAtrasoMaximo(
    cliente: Partial<Cliente>,
    tipo: TipoDePedido,
    errors: Warning[]
  ) {
    if (tipo === TipoDePedido.CREDITO) {
      if (cliente.credito) {
        if (cliente.credito.atrasoMaximo > 7) {
          errors.push({
            error: 'ATRASO_MAXIMO',
            descripcion: 'CREDITO CON ATRASOS > 7',
          });
        }
      }
    }
  }

  static ValidarCreditoDisponible(
    cliente: Partial<Cliente>,
    tipo: TipoDePedido,
    partidas: Partial<PedidoDet>[],
    errors: Warning[]
  ) {
    if (tipo === TipoDePedido.CREDITO) {
      if (cliente.credito) {
        const credito = cliente.credito;
        const disponible = credito.lineaDeCredito - credito.saldo;
        const total = round(sumBy(partidas, 'total'), 2);

        if (disponible < total) {
          errors.push({
            error: 'LINEA_INSUFICIENTE',
            descripcion: 'CREDITO INSUFICIENTE',
          });
        }
      }
    }
  }

  static ValidarAutorizacionPorDescuentoEspecial(
    descuentoEspecial = 0,
    errors: Warning[]
  ) {
    if (!descuentoEspecial || descuentoEspecial <= 0) return null;
    errors.push({
      error: 'DESCUENTO_ESPECIAL',
      descripcion: 'DESCUENTO ESPECIAL REQUIERE AUTORIZACION',
    });
  }

  static ValidarAutorizacionPorFaltaDeExistencia(
    partidas: Partial<PedidoDet>[],
    errors: Warning[]
  ) {
    if (partidas.length <= 0) return;
    const pendientes = partidas
      .map((item) => (item.faltante ? item.faltante : 0))
      .reduce((prev, curr) => prev + curr);
    if (pendientes <= 0) return;

    errors.push({
      error: 'EXISTENCIA_FALTANTE',
      descripcion: 'FALTA EXISTENCIA REQUIERE AUTORIZACION',
    });
  }
}
