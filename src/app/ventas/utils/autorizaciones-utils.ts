import { PedidoDet, PedidoAutorizacion } from '@papx/models';

import isEmpty from 'lodash-es/isEmpty';

export class AutorizacionesDePedido {
  static Requeridas(
    items: Partial<PedidoDet>[],
    descuentoEspecial: number = 0,
    auth: PedidoAutorizacion = null
  ) {
    const res =
      '' + this.PorDescuentoEspecial(descuentoEspecial, auth) ??
      '' + this.PorFaltaDeExistencia(items, auth) ??
      '';
    return isEmpty(res) ? null : res;
  }

  static PorDescuentoEspecial(
    descuentoEspecial: number,
    autorizacion?: PedidoAutorizacion
  ): String {
    if (!descuentoEspecial || descuentoEspecial <= 0) return null;
    if (autorizacion) return null;
    return 'DESCUENTO_ESPECIAL';
  }

  static PorFaltaDeExistencia(
    partidas: Partial<PedidoDet>[],
    autorizacion?: PedidoAutorizacion
  ) {
    if (partidas.length <= 0) return '';
    if (autorizacion) return '';
    const pendientes = partidas
      .map((item) => (item.faltante ? item.faltante : 0))
      .reduce((prev, curr) => prev + curr);
    if (pendientes <= 0) return;
    return 'EXISTENCIA_FALTANTE';
  }
}
