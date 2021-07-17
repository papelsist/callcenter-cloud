import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '@papx/auth';
import { LoadingService } from '@papx/common/ui-core';
import { CatalogosService, MailService } from '@papx/data-access';
import { Pedido, User } from '@papx/models';
import { ReportsService } from '@papx/shared/reports/reports.service';
import { BehaviorSubject, combineLatest } from 'rxjs';
import {
  delay,
  distinctUntilChanged,
  finalize,
  map,
  shareReplay,
  take,
  tap,
} from 'rxjs/operators';
import { CerrarPedidoController } from '../../shared/cerrar-pedido/cerrar-pedido-controller';

import { VentasDataService } from '../ventas-data.service';

export interface PedidosState {
  current: Pedido | null;
  user: User | null;
  cart: Partial<Pedido> | null;
}

let _state: PedidosState = {
  current: null,
  user: null,
  cart: null,
};

@Injectable({ providedIn: 'root' })
export class PedidosFacade {
  private store = new BehaviorSubject<PedidosState>(_state);
  state$ = this.store.asObservable();
  current$ = this.state$.pipe(
    map((state) => state.current),
    distinctUntilChanged()
  );

  cart$ = this.state$.pipe(
    map((state) => state.cart),
    distinctUntilChanged(),
    shareReplay(1)
  );
  userInfo$ = this.authService.userInfo$;

  vm$ = combineLatest([this.authService.userInfo$, this.current$]).pipe(
    map(([user, pedido]) => ({ user, pedido }))
  );

  constructor(
    private authService: AuthService,
    private dataService: VentasDataService,
    private reports: ReportsService,
    private mailService: MailService,
    private loading: LoadingService,
    private alertController: AlertController,
    private cerrarPedidoController: CerrarPedidoController,
    private catalogos: CatalogosService
  ) {}

  setCurrent(pedido: Pedido) {
    _state = { ..._state, current: pedido };
    this.store.next(_state);
  }

  getSucursalByNombre(nombre: string) {
    return this.catalogos.getSucursalByName(nombre);
  }

  async updatePedido(id: string, pedido: Partial<Pedido>, user: User) {
    await this.dataService.updatePedido(id, pedido, user);
  }

  async cerrarPedido(pedido: Partial<Pedido>, user: User) {
    const cerrar = await this.cerrarPedidoController.cerrar(pedido);
    if (cerrar) {
      try {
        await this.dataService.cerrarPedido(pedido, user);
        return true;
      } catch (error) {
        await this.handleError('Error cerrando pedido', error.message);
      }
    } else {
      return false;
    }
  }

  async saveCartState(state: Partial<Pedido>, user: User) {
    await this.dataService.saveCart(state, user.uid);
  }

  getCartState(user: User) {
    return this.dataService.getCart(user.uid);
  }

  cleanCart(user: User) {
    console.log('Limpiando cart:', user.uid);
    return this.dataService.deleteCart(user.uid);
  }

  reloadCurrent(id: string) {
    this.dataService
      .findById(id)
      .pipe(take(1))
      .subscribe((c) => this.setCurrent(c));
  }

  fetchPedido(id: string) {
    return this.dataService.fetchPedido(id);
  }

  async printPedido(pedido: Partial<Pedido>, user: User) {
    this.reports.imprimirPedido(pedido, user);
  }

  async deletePedido(pedido: Partial<Pedido>, user: User) {
    await this.dataService.deletePedido(pedido.id);
    await this.dataService.deleteCart(user.uid);
  }

  sendFacturaByEmail(
    pedido: Partial<Pedido>,
    target: string,
    pdfUrl: string,
    xmlUrl: string
  ) {
    const { nombre, factura } = pedido;

    this.loading.startLoading('Enviando correo....');
    this.mailService
      .sendFactura(factura, nombre, target, pdfUrl, xmlUrl)
      .pipe(
        delay(1000),
        take(1),
        map((res) => res.Messages[0]),
        finalize(async () => {
          console.log('Stoping loading indicator');
          this.loading.stopLoading();
        })
      )
      .subscribe(
        (res) => {
          console.log('Correo enviado Res: ', res);
          this.showMessage('A: ' + target, 'Envío exitoso');
        },
        async (err) => await this.handleError('Error enviando factura', err)
      );
    // return this.mailService.sendFactura(factura, nombre, target, pdfUrl, xmlUrl)
  }

  async handleError(header: string, err: any) {
    const message = err.message;
    this.showMessage(message, header);
  }

  async showMessage(message: string, header: string, subHeader?: string) {
    const alert = await this.alertController.create({
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
    await alert.present();
  }

  async autorizar(pedido: Partial<Pedido>) {
    console.log('Evaluando pedido: ', pedido);
    /*
    const inputs = pedido.warnings.map((it) => ({
      disabled: true,
      value: it.descripcion,
    }));
    */
    const inputs = [
      {
        disabled: true,
        value: pedido.autorizacionesRequeridas,
      },
    ];
    const alert = await this.alertController.create({
      header: 'Autorizar pedido: ' + pedido.folio,
      subHeader: pedido.nombre,
      message: `Total: ${pedido.total} (Vend: ${pedido.updateUser})`,
      animated: true,
      cssClass: 'autorizacion-de-pedido-alert',
      inputs: [
        ...inputs,
        {
          type: 'text',
          placeholder: 'Comentario',
          name: 'comentario',
          handler: (value) => ({ comentario: value }),
        },
      ],
      //inputs: [pedido.warnings.map( w => ({}))],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => ({ autorizar: false }),
        },
        {
          text: 'Aceptar',
          role: 'accept',
          handler: () => ({ autorizar: true }),
        },
      ],
    });
    await alert.present();
    const { data } = await alert.onDidDismiss();
    return data;
    // if (data) {
    //   const {
    //     autorizar,
    //     values: { comentario },
    //   } = data;
    //   return { autorizar, comentario };
    // } else {
    //   return null;
    // }
    /*
    const {
      data: {
        autorizar,
        values: { comentario },
      },
    } = await alert.onDidDismiss();
    return { autorizar, comentario };
    */
  }
}
