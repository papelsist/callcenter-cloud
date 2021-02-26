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
    items: Partial<PedidoDet>[],
    p: Pedido
  ) {
    const warnings = [];
    this.ValidarClienteActivo(cliente, warnings);
    this.ValidarCreditoVigente(cliente, tipo, warnings);
    this.ValidarAtrasoMaximo(cliente, tipo, warnings);
    this.ValidarCreditoDisponible(cliente, tipo, items, warnings);
    this.ValidarAutorizacionPorDescuentoEspecial(p, warnings);
    this.ValidarAutorizacionPorFaltaDeExistencia(p, items, warnings);
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
    pedido: Partial<Pedido>,
    errors: Warning[]
  ) {
    if (pedido.descuentoEspecial <= 0) return;
    const existentes = pedido.autorizaciones ?? [];
    const found = existentes.find((item) => item.tipo === 'DESCUENTO_ESPECIAL');
    if (!found) {
      errors.push({
        error: 'DESCUENTO_ESPECIAL',
        descripcion: 'DESCUENTO ESPECIAL REQUIERE AUTORIZACION',
      });
    }
  }

  static ValidarAutorizacionPorFaltaDeExistencia(
    pedido: Partial<Pedido>,
    partidas: Partial<PedidoDet>[],
    errors: Warning[]
  ) {
    if (partidas.length <= 0) return;

    const pendientes = partidas
      .map((item) => (item.faltante ? item.faltante : 0))
      .reduce((prev, curr) => prev + curr);
    if (pendientes <= 0) return;

    const existentes = pedido.autorizaciones ?? [];
    const found = existentes.find(
      (item) => item.tipo === 'EXISTENCIA_FALTANTE'
    );
    if (!found) {
      errors.push({
        error: 'EXISTENCIA_FALTANTE',
        descripcion: 'FALTA EXISTENCIA REQUIERE AUTORIZACION',
      });
    }
  }
}
