import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  PopoverController,
} from '@ionic/angular';

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
  data = {};
  errors: any;

  partidas$ = this.facade.partidas$;
  @ViewChild(PedidoCreateFormComponent) form: PedidoCreateFormComponent;
  constructor(
    private facade: PedidoCreateFacade,
    private dataService: VentasDataService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private actionSheet: ActionSheetController
  ) {}

  ngOnInit() {}

  async onSave(event: any) {
    // this.startLoading();
    console.log('Salvando pedido: ', event);
    /*
    this.dataService.addPedido(event).subscribe(
      (p) => console.log('Pedido: ', p),
      async (err) => this.handleHerror(err),
      () => {
        console.log('Terminated');
      }
    );
    */
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
}
