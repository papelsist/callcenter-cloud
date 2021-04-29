import { Component, OnDestroy, OnInit } from '@angular/core';
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
  constructor(
    public facade: PedidosFacade,
    private router: Router,
    private loading: LoadingService,
    private reports: ReportsService,
    private popoverController: PopoverController
  ) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.facade.setCurrent(null);
  }

  async onSave(id: string, pedido: Partial<Pedido>, user: User) {
    pedido.status = 'COTIZACION';
    await this.facade.updatePedido(id, pedido, user);
    this.router.navigate(['/', 'ventas', 'cotizaciones']);
  }

  async onCerrar(id: string, pedido: Partial<Pedido>, user: User) {
    await this.facade.cerrarPedido(id, pedido, user);
    this.router.navigate(['/', 'ventas', 'cotizaciones']);
  }

  onErrors(event: any) {
    this.errors = event;
  }

  onWarnings(warnings: any[]) {
    this.warnings = warnings;
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

  showMessage(message: string, header: string) {}

  async handleError(err: any) {
    console.log('Err: ', err);
  }
  showErrors(errrors: any) {}
}
