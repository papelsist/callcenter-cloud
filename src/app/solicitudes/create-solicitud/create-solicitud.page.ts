import { Component, OnInit } from '@angular/core';

import {
  Cartera,
  carteraDisplayName,
  FormaDePago,
  SolicitudDeDeposito,
  User,
  Pedido,
  Status,
} from '@papx/models';

import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { AuthService } from '@papx/auth';
import { AlertController } from '@ionic/angular';

import { map, take } from 'rxjs/operators';
import { SolicitudesService } from '@papx/shared/solicitudes/@data-access/solicitudes.service';

import toNumber from 'lodash-es/toNumber';
import isNumber from 'lodash-es/isNumber';
import { VentasDataService } from 'src/app/ventas/@data-access';
import { CatalogosService } from '@papx/data-access';

@Component({
  selector: 'papx-create-solicitud',
  templateUrl: './create-solicitud.page.html',
  styleUrls: ['./create-solicitud.page.scss'],
})
export class CreateSolicitudPage implements OnInit {
  cartera: Cartera = 'CON';
  sucursal$ = this.auth.sucursal$.pipe(
    map((nombre) => this.catalogosService.getSucursalByName(nombre))
  );

  vm$ = combineLatest([
    this.auth.userInfo$,
    this.auth.claims$,
    this.sucursal$,
  ]).pipe(
    map(([user, claims, sucursal]) => ({
      user,
      claims,
      sucursal,
      creditoUser: !!claims.xpapCxcUser,
    }))
  );

  pedido: Partial<Pedido> = null;

  constructor(
    private service: SolicitudesService,
    private catalogosService: CatalogosService,
    private pedidoDataService: VentasDataService,
    private auth: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  async onSave(sol: Partial<SolicitudDeDeposito>, user: User) {
    try {
      sol.tipo = this.cartera;
      console.log('Crear solicitud: ', sol);
      const fol = await this.service.createSolicitud(sol, user);
      this.router.navigate(['solicitudes']);
    } catch (error) {
      this.handleError(error.message);
    }
  }

  async validarDuplicado(sol: Partial<SolicitudDeDeposito>) {
    const found = await this.service.buscarDuplicado(sol);
    if (found.length > 0) {
      const { sucursal, solicita, total } = found[0];
      const message = `Existe un depósito YA REGISTRADO con
        los mismos datos (importe, banco, cuenta y fecha)
        en la sucursal ${sucursal}. Registrado por: ${solicita}`;
      const alert = await this.alertController.create({
        header: 'Alerta',
        subHeader: `Posible deposito duplicado por`,
        message,
        buttons: ['OK'],
        cssClass: 'create-solicitud-custom-alert',
      });
      await alert.present();
    }
  }

  onLookupPedido(event: number) {
    const folio = toNumber(event);
    if (isNumber(folio)) {
      console.log('Localizando pedido: ', folio);
      this.pedidoDataService.findByFolio(folio).subscribe(
        (found) => {
          if (!found) {
            this.handleError('Folio: ' + folio, 'Error', 'No existe el pedido');
            return;
          }

          if (
            this.validarFormaDePago(found) &&
            this.validarStatus(found) &&
            this.validarExistente(found)
          ) {
            this.pedido = found;
          }
        },
        (err) =>
          this.handleError(
            err.message,
            'Firebase error',
            'Error buscando pedido'
          )
      );
    }
  }

  private validarExistente(pedido: Partial<Pedido>) {
    if (pedido.solicitud) {
      this.handleError(
        'El pedido ya se encuentra referenciado en la solicitud:: ' +
          pedido.solicitud,
        'Error',
        'Pedido: ' + pedido.folio
      );
      return false;
    }
    return true;
  }

  private validarFormaDePago(pedido: Partial<Pedido>) {
    const { folio, formaDePago } = pedido;
    const valid = [
      FormaDePago.TRANSFERENCIA,
      FormaDePago.DEPOSITO_CHEQUE,
      FormaDePago.DEPOSITO_EFECTIVO,
    ];
    if (!valid.includes(formaDePago)) {
      this.handleError(
        'Forma de pago incorrecta: ' + formaDePago,
        'Error',
        'Pedido: ' + folio
      );
      return false;
    }
    return true;
  }

  private validarStatus(pedido: Partial<Pedido>) {
    const { folio, status } = pedido;
    const valid: Status[] = ['COTIZACION', 'PENDIENTE', 'POR_AUTORIZAR'];
    if (!valid.includes(status)) {
      this.handleError(
        'Status: ' + status,
        'Error',
        'Pedido incorrecto: ' + folio
      );
      return false;
    }
    return true;
  }

  get carteraName() {
    return carteraDisplayName(this.cartera);
  }

  async handleError(
    message: string,
    header = 'Error salvando datos',
    subHeader = 'Firebase error'
  ) {
    const al = await this.alertController.create({
      header,
      subHeader,
      message,
      mode: 'ios',
      animated: true,
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel',
        },
      ],
    });
    await al.present();
  }
}
