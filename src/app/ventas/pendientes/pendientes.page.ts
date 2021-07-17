import { Component } from '@angular/core';

import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import isEmty from 'lodash-es/isEmpty';

import { VentasDataService } from '../@data-access';
import { AuthService } from '@papx/auth';
import {
  buildCriteria,
  Pedido,
  PedidosSearchCriteria,
  User,
} from '@papx/models';
import { filtrarPedidos } from '../@data-access/+state';
import { PendientesController } from './pendientes.controller';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pendientes',
  templateUrl: './pendientes.page.html',
  styleUrls: ['./pendientes.page.scss'],
})
export class PendientesPage {
  filtrarPorUsuario$ = new BehaviorSubject<boolean>(false);
  searchCriteria: any = null;
  textFilter$ = new BehaviorSubject<string>('');

  pedidos$ = this.dataService.findPendientes();
  filteredPedidos$ = filtrarPedidos(this.pedidos$, this.textFilter$);
  criteria: PedidosSearchCriteria = buildCriteria();

  vm$ = combineLatest([
    this.filtrarPorUsuario$,
    this.auth.userInfo$,
    this.filteredPedidos$,
    this.auth.claims$,
  ]).pipe(
    map(([filtrar, user, pedidos, claims]) => ({
      filtrar,
      user,
      pedidos: filtrar
        ? pedidos.filter((item) => item.updateUserId === user.uid)
        : pedidos,
      claims,
    }))
  );

  constructor(
    private dataService: VentasDataService,
    private auth: AuthService,
    private controller: PendientesController,
    private router: Router
  ) {}

  filtrarPorUsuario(val: boolean) {
    this.filtrarPorUsuario$.next(!val);
  }
  onFilter(event: string) {
    this.textFilter$.next(event);
  }

  async autorizar(pedido: Pedido, user: User) {
    const { autorizar, comentario } = await this.controller.autorizar(pedido);

    if (autorizar && !isEmty(comentario)) {
      await this.controller.starLoading();
      try {
        await this.dataService.autorizarPedido(pedido, comentario, user);
        await this.controller.stopLoading();
      } catch (error) {
        await this.controller.stopLoading();
        this.controller.handelError(error);
      }
    }
  }

  async regresar(pedido: Pedido, user: User, claims: any) {
    if (['EN_SUCURSAL'].includes(pedido.status)) {
      if (!claims['xpapCallcenterAdmin']) {
        console.debug('No tiene derechos para regresar pedidos');
        return;
      }
      if (!pedido.puesto) {
        const res = await this.controller.regresar(pedido);

        if (res) {
          await this.controller.starLoading();
          try {
            await this.dataService.regresarPedido(pedido, user);
            await this.controller.stopLoading();
          } catch (error) {
            await this.controller.stopLoading();
            this.controller.handelError(error);
          }
        }
      }
    }
  }

  onConsultar(event: Partial<Pedido>) {
    this.router.navigate(['', 'ventas', 'cotizaciones', 'view', event.id]);
  }

  getTitle(filtered: boolean) {
    return filtered ? 'Mis pedidos pendientes' : 'Pendientes de antender';
  }
}
