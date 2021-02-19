import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { VentasDataService } from '../@data-access';
import { ItemController } from '../shared/ui-pedido-item';
import { PedidoCreateFacade } from './pedido-create.facade';
import * as test from './test.data';
@Component({
  selector: 'app-pedido-create',
  templateUrl: './pedido-create.page.html',
  styleUrls: ['./pedido-create.page.scss'],
  providers: [PedidoCreateFacade],
})
export class PedidoCreatePage implements OnInit {
  data = test.demoPedidoCre();
  partidas = test.TEST_PARTIDAS;
  partidas$ = this.facade.partidas$;
  constructor(
    private facade: PedidoCreateFacade,
    private dataService: VentasDataService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private itemController: ItemController
  ) {}

  ngOnInit() {}

  async addItem() {
    const item = await this.itemController.addItem();
    console.log('Item: ', item);
    return item ? this.facade.addItem(item) : null;
  }

  async onSave(event: any) {
    // this.startLoading();
    console.log('Salvando pedido: ', event);

    this.dataService.addPedido(event).subscribe(
      (p) => console.log('Pedido: ', p),
      async (err) => this.handleHerror(err),
      () => {
        console.log('Terminated');
      }
    );
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
}
