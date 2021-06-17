import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { AlertController, PopoverController } from '@ionic/angular';
import { LoadingService } from '@papx/common/ui-core';
import { Cliente, Pedido, User } from '@papx/models';
import { ReportsService } from '@papx/shared/reports/reports.service';
import { combineLatest } from 'rxjs';
import { catchError, finalize, map, switchMap, take } from 'rxjs/operators';
import { VentasDataService } from '../@data-access';
import { PedidosFacade } from '../@data-access/+state';
import { EmailTargetComponent } from '../shared/buttons';
import { PedidoCreateFormComponent } from '../shared/pedido-form';

@Component({
  selector: 'app-pedido-edit',
  templateUrl: './pedido-edit.page.html',
  styleUrls: ['./pedido-edit.page.scss'],
})
export class PedidoEditPage implements OnInit, OnDestroy {
  errors: any;
  warnings: any[];
  // current$ = this.route.paramMap.pipe(
  //   switchMap((params) => this.facade.fetchPedido(params.get('id')))
  // );
  // userInfo$ = this.facade.userInfo$;

  // vm$ = combineLatest([this.userInfo$, this.current$]).pipe(
  //   map(([user, pedido]) => ({ user, pedido }))
  // );

  vm$ = this.facade.vm$;
  descuentEspecial = 0.0;

  @ViewChild(PedidoCreateFormComponent) form: PedidoCreateFormComponent;
  constructor(
    public facade: PedidosFacade,
    private router: Router,
    private loading: LoadingService,
    private reports: ReportsService,
    private popoverController: PopoverController,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.facade.setCurrent(null);
  }

  async onSave(id: string, pedido: Partial<Pedido>, user: User) {
    pedido.status = 'COTIZACION';
    await this.facade.updatePedido(id, pedido, user);
    this.router.navigate(['/', 'ventas', 'cotizaciones']);
    // console.log('Pedido por salvar: ', pedido);
  }

  async onCerrar(id: string, pedido: Partial<Pedido>, user: User) {
    const ok = await this.facade.cerrarPedido(pedido, user);
    if (ok) {
      this.router.navigate(['/', 'ventas', 'cotizaciones']);
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

  async onPrint(event: Pedido, user: User) {
    this.reports.imprimirPedido(event, user);
  }

  async onEmail(cliente: Partial<Cliente>, event: Pedido, user: User) {
    let current = event.cfdiMail;
    if (!!current && cliente.medios) {
      const found = cliente.medios.find((item) => item.tipo === 'MAIL');
      current = found ? found.descripcion : null;
    }
    const alert = await this.popoverController.create({
      component: EmailTargetComponent,
      componentProps: { value: current },
      cssClass: 'emal-target-popover',
      mode: 'ios',
    });
    await alert.present();
    const { data } = await alert.onWillDismiss();
    if (data) {
      await this.loading.startLoading('Enviando correo....');
      try {
        const pdf = await this.reports.getPedidoPdf(event, user);
        const res = await this.reports
          .enviarPedido(data, event, pdf)
          .toPromise();
        console.log('Res: ', res);
        await this.loading.stopLoading();
      } catch (err) {
        await this.loading.stopLoading('');
        this.handleError(err);
      }
    }
  }

  async onDelete(pedido: Partial<Pedido>, user: User) {
    const alert = await this.alertController.create({
      animated: true,
      header: 'Eliminar pedido',
      subHeader: 'Folio: ' + pedido.folio,
      message: 'Seguro que desea eliminar',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Aceptar',
          handler: () => true,
        },
      ],
    });
    await alert.present();
    const { data } = await alert.onWillDismiss();
    if (data) {
      await this.facade.deletePedido(pedido, user);
      this.router.navigateByUrl('/ventas/cotizaciones');
    } else {
      console.log('No eliminar');
    }
  }

  private doDelete(pedido: Partial<Pedido>, user: User) {
    console.log('Eliminar pedido: ', pedido.folio);
  }

  showMessage(message: string, header: string) {}

  async handleError(err: any) {
    console.log('Err: ', err);
  }
  showErrors(errrors: any) {}

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
    console.log('Mostrar descuentos por volumen...');
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
    console.log('Localizar producto...');
    // this.productoServie
    //   .openSelector()
    //   .subscribe((prod) => this.facade.addCartItem(prod));
  }
}
