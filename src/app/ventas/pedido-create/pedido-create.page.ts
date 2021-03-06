import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

import { AuthService } from '@papx/auth';
import { Pedido, User } from '@papx/models';
import { VentasDataService } from '../@data-access';

import { PedidoCreateFacade } from './pedido-create.facade';
import { PedidoCreateFormComponent } from '../shared/pedido-form';
import { getClienteMostrador } from '../utils';

@Component({
  selector: 'app-pedido-create',
  templateUrl: './pedido-create.page.html',
  styleUrls: ['./pedido-create.page.scss'],
  providers: [PedidoCreateFacade],
})
export class PedidoCreatePage implements OnInit {
  data = {
    sucursal: 'TACUBA',
    sucursalId: '402880fc5e4ec411015e4ec64e70012e',
    cliente: getClienteMostrador(),
    nombre: 'MOSTRADOR',
  };
  errors: any;
  warnings: any[];
  user$ = this.authService.userInfo$;

  @ViewChild(PedidoCreateFormComponent) form: PedidoCreateFormComponent;
  constructor(
    private authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private dataService: VentasDataService,
    private router: Router
  ) {}

  ngOnInit() {}

  async onSave(pedido: Partial<Pedido>, user: User) {
    // this.startLoading();
    pedido.createUser = user.displayName;
    pedido.updateUser = user.displayName;
    pedido.status = 'COTIZACION';
    console.log('Salvando pedido: ', pedido);
    try {
      const folio = await this.dataService.createPedido(pedido, user);
      this.router.navigate(['/', 'ventas', 'cotizaciones']);
    } catch (error) {
      this.handleHerror(error);
    }
  }

  onErrors(event: any) {
    this.errors = event;
  }

  onWarnings(warnings: any[]) {
    this.warnings = warnings;
  }

  async startLoading(message: string = 'Procesando') {
    const loading = await this.loadingController.create({
      message,
    });
    loading.present();
  }

  async stopLoading() {
    await this.loadingController.dismiss();
  }

  async handleHerror(err: any) {
    console.error('MY ERR', err);
    const alert = await this.alertController.create({
      header: 'Error de base de datos',
      subHeader: '',
      message: err.message,
    });
    await alert.present();
  }

  async showErrors(errors: any) {
    console.log('Mostrar errores: ', errors);
  }
}
