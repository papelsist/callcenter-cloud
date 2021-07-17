import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { SolicitudDeDeposito, UpdateSolicitud, UserInfo } from '@papx/models';

import { EditSolicitudState } from './edit-solicitud-state';

@Component({
  selector: 'app-edit-solicitud',
  templateUrl: './edit-solicitud.page.html',
  styleUrls: ['./edit-solicitud.page.scss'],
})
export class EditSolicitudPage implements OnInit {
  vm$ = this.state.vm$;
  constructor(
    private state: EditSolicitudState,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  async onSave(sol: SolicitudDeDeposito, changes: any, userInfo: UserInfo) {
    await this.state.update(sol, changes, userInfo);
    this.router.navigate(['/', 'solicitudes', 'pendientes']);
  }

  async validarDuplicado(sol: Partial<SolicitudDeDeposito>) {
    const found = await this.state.buscarDuplicado(sol);
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
}
