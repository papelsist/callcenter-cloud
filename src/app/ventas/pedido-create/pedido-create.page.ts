import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

import { AuthService } from '@papx/auth';
import { Pedido, User, UserInfo } from '@papx/models';
import { VentasDataService } from '../@data-access';

import { PedidoCreateFacade } from './pedido-create.facade';
import { PedidoCreateFormComponent } from '../shared/pedido-form';
import { getClienteMostrador } from '../utils';
import { PedidosFacade } from '../@data-access/+state';
import { map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-pedido-create',
  templateUrl: './pedido-create.page.html',
  styleUrls: ['./pedido-create.page.scss'],
  providers: [PedidoCreateFacade],
})
export class PedidoCreatePage implements OnInit, OnDestroy {
  errors: any;
  warnings: any[];
  private _user: UserInfo = null;
  user$ = this.authService.userInfo$.pipe(tap((u) => (this._user = u)));
  private _saveCart = true;
  cart$ = this.user$.pipe(
    switchMap((user) =>
      this.pedidoFacade.getCartState(user).pipe(
        map((state) => {
          if (state) {
            if (state.envio === null) delete state.envio;
            return state;
          } else {
            const res = {
              sucursal: 'TACUBA',
              sucursalId: '402880fc5e4ec411015e4ec64e70012e',
              cliente: getClienteMostrador(),
              nombre: 'MOSTRADOR',
            };

            if (user.sucursal) {
              const ss = this.pedidoFacade.getSucursalByNombre(user.sucursal);
              if (ss) {
                (res.sucursal = ss.nombre), (res.sucursalId = ss.id);
              }
            }
            return res;
          }
        })
      )
    )
  );

  sucursal$ = this.authService.sucursal$;

  vm$ = combineLatest([this.user$, this.cart$]).pipe(
    map(([user, cart]) => ({ user, cart }))
  );
  descuentEspecial = 0.0;
  @ViewChild(PedidoCreateFormComponent) form: PedidoCreateFormComponent;
  constructor(
    private authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private dataService: VentasDataService,
    private pedidoFacade: PedidosFacade,
    private router: Router
  ) {}

  ngOnInit() {
    // this.cart$.subscribe((cart) => console.log('Cart: ', cart));
  }

  ngOnDestroy() {}

  ionViewDidLeave() {
    /*
    if (this._user && this._saveCart) {
      this.pedidoFacade.saveCartState(this.form.getCartState(), this._user);
    }
    */
  }

  async onSave(pedido: Partial<Pedido>, user: User) {
    // this.startLoading();
    pedido.createUser = user.displayName;
    pedido.updateUser = user.displayName;
    pedido.status = 'COTIZACION';

    try {
      await this.dataService.createPedido(pedido, user);
      this._saveCart = false;
      await this.pedidoFacade.cleanCart(user);
      this.router.navigateByUrl('/ventas/cotizaciones');
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
  onDescuentoEspecial(descuento: number) {
    this.descuentEspecial = descuento;
  }

  async onClean(form: any, user: User) {
    try {
      await this.startLoading('Limpiando pedido');
      await this.pedidoFacade.cleanCart(user);
      form.cleanForm();
      await this.stopLoading();
    } catch (error) {
      await this.stopLoading();
      const alert = await this.alertController.create({
        header: 'Error limpiando el pedido',
        subHeader: '',
        message: error.message,
      });
      await alert.present();
    }
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
    const alert = await this.alertController.create({
      header: 'Error de base de datos',
      subHeader: '',
      message: err.message,
    });
    await alert.present();
  }

  /** Insert item */
  @HostListener('document:keydown.meta.i', ['$event'])
  async onHotKeyInsert(event: KeyboardEvent) {
    event.stopPropagation();
    await this.form.addItem();
  }
  @HostListener('document:keydown.insert', ['$event'])
  async onHotKeyInsert2(event: KeyboardEvent) {
    event.stopPropagation();
    await this.form.addItem();
  }

  /** Show descuentos */
  @HostListener('document:keydown.control.d', ['$event'])
  async onHotKeyShowDescuentos(event: KeyboardEvent) {
    await this.form.showDescuentos();
  }

  /** Cliente nuevo */
  @HostListener('document:keydown.control.a', ['$event'])
  async onHotKeyAltaDeCliente(event: KeyboardEvent) {
    await this.form.onClienteNuevo();
  }

  @HostListener('document:keydown.control.shift.s', ['$event'])
  onHotKeyCloseCart(event: KeyboardEvent) {
    this.form.submit();
  }

  @HostListener('document:keydown.f2', ['$event'])
  onHotKeyAltP(event: KeyboardEvent) {
    // this.productoServie
    //   .openSelector()
    //   .subscribe((prod) => this.facade.addCartItem(prod));
  }
}
