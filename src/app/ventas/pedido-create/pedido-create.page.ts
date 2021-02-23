import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  ActionSheetController,
  AlertController,
  LoadingController,
} from '@ionic/angular';

import { AuthService } from '@papx/auth';
import { Pedido, User } from '@papx/models';
import { VentasDataService } from '../@data-access';

import { PedidoCreateFacade } from './pedido-create.facade';
import { PedidoCreateFormComponent } from '../shared/ui-pedido/create-form/pcreate-form.component';

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
  };
  errors: any;
  user$ = this.authService.userInfo$;

  @ViewChild(PedidoCreateFormComponent) form: PedidoCreateFormComponent;
  constructor(
    private authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private actionSheet: ActionSheetController,
    private dataService: VentasDataService,
    private router: Router
  ) {}

  ngOnInit() {}

  async onSave(pedido: Partial<Pedido>, user: User) {
    // this.startLoading();
    pedido.createUser = user.displayName;
    pedido.updateUser = user.displayName;
    pedido.status = 'COTIZACION';
    // console.log('Salvando pedido: ', pedido);

    this.dataService.addPedido(pedido).subscribe(
      (res) => {
        console.log('Saved done, res: ', res);
        this.router.navigate(['/', 'ventas', 'cotizaciones']);
      },
      async (err) => this.handleHerror(err),
      () => console.log('Terminated')
    );
  }

  onErrors(event: any) {
    this.errors = event;
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

  async showOptions(ev: any) {
    const actionSheet = await this.actionSheet.create({
      header: 'Operaciones',
      cssClass: 'create-options',
      buttons: [
        {
          text: 'Descuento especial',
          icon: 'barbell',
          handler: async () => this.form.setDescuentoEspecial(),
        },
        {
          text: 'Cerrar',
          role: 'cancel',
          icon: 'close',
        },
      ],
    });
    await actionSheet.present();
  }

  async showErrors(errors: any) {
    console.log('Mostrar errores: ', errors);
  }
}
