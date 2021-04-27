import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { LoadingService } from '@papx/common/ui-core';
import { Pedido, User } from '@papx/models';
import { ReportsService } from '@papx/shared/reports/reports.service';
import { combineLatest } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { VentasDataService } from '../@data-access';
import { PedidosFacade } from '../@data-access/+state';

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
    private route: ActivatedRoute,
    private service: VentasDataService,
    private loading: LoadingService,
    private reports: ReportsService
  ) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.facade.setCurrent(null);
  }

  async onSave(id: string, pedido: Partial<Pedido>, user: User) {
    pedido.status = 'COTIZACION';
    // console.log('Actualizando pedido: ', pedido);
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

  async showErrors(errors: any) {
    console.log('Mostrar errores: ', errors);
  }

  async onPrint(event: Pedido, user: User) {
    this.reports.imprimirPedido(event, user);
  }
}
