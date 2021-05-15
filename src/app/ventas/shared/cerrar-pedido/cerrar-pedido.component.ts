import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Pedido, SolicitudDeDeposito } from '@papx/models';

import isEmpty from 'lodash-es/isEmpty';

@Component({
  selector: 'papx-cerrar-pedido',
  templateUrl: './cerrar-pedido.component.html',
  styleUrls: ['./cerrar-pedido.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CerrarPedidoComponent implements OnInit {
  @Input() pedido: Partial<Pedido>;
  @Input() solicitud: SolicitudDeDeposito;
  constructor(private controller: PopoverController) {}

  ngOnInit() {}

  async close() {
    await this.controller.dismiss();
  }
  async submit() {
    await this.controller.dismiss({ cerrar: true });
  }

  requiereAutorizacion() {
    const { autorizacionesRequeridas, autorizacion } = this.pedido;
    if (!isEmpty(autorizacionesRequeridas)) {
      return !autorizacion;
    }
    return false;
  }

  requiereDeposito() {
    const { formaDePago } = this.pedido;
    return (
      formaDePago === 'TRANSFERENCIA' || formaDePago.startsWith('DEPOSITO')
    );
  }

  isDisabled() {
    if (this.requiereAutorizacion()) {
      return true;
    } else if (this.requiereDeposito()) {
      return !this.solicitud ? this.solicitud.status !== 'AUTORIZADO' : true;
    } else {
      return false;
    }
  }
}
