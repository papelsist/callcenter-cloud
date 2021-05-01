import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import {
  map,
  startWith,
  switchMap,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import sortBy from 'lodash-es/sortBy';
import { formatISO } from 'date-fns';
import { parseISO } from 'date-fns';

import { AuthService } from '@papx/auth';
import { BaseComponent } from '@papx/core';
import { Pedido, PedidosSearchCriteria, User } from '@papx/models';
import { VentasDataService } from '../@data-access';
import { PedidosFacade } from '../@data-access/+state';

import { VentasController } from '../shared/ventas.controller';
import { CotizacionesFacade } from './cotizaciones-facade';

@Component({
  selector: 'app-cotizaciones',
  templateUrl: './cotizaciones.page.html',
  styleUrls: ['./cotizaciones.page.scss'],
  providers: [CotizacionesFacade],
})
export class CotizacionesPage extends BaseComponent implements OnInit {
  params = this.readParams();

  filtrarPorUsuario$ = new BehaviorSubject<boolean>(
    this.params.filtrarPorUsuario
  );
  user$ = this.auth;
  criteria$ = new BehaviorSubject<PedidosSearchCriteria>(null);
  textFilter$ = new BehaviorSubject<string>('');

  vm$ = combineLatest([
    this.filtrarPorUsuario$,
    this.auth.userInfo$,
    this.criteria$,
  ]).pipe(map(([filtrar, user, criteria]) => ({ filtrar, user, criteria })));

  searchCriteria: any = null;

  cotizaciones$ = this.vm$.pipe(
    switchMap((vm) => this.dataService.findCotizaciones(vm.criteria))
  );
  filteredCotizaciones$ = combineLatest([
    this.textFilter$,
    this.cotizaciones$,
  ]).pipe(
    map(([term, rows]) =>
      term.length === 0
        ? rows
        : rows.filter((item) => {
            const cc = `${item.folio.toString()}${item.nombre.toLowerCase()}${item.sucursal.toLowerCase()}${item.createUser.toLowerCase()}${item.updateUser?.toLowerCase()}`;
            return cc.includes(term.toLowerCase());
          })
    )
  );

  constructor(
    private facade: PedidosFacade,
    private router: Router,
    private ventasController: VentasController,
    private pedidosFacade: PedidosFacade,
    private alert: AlertController,
    private auth: AuthService,
    private dataService: VentasDataService
  ) {
    super();
  }

  ngOnInit() {}

  private readParams() {
    console.log('Reading params from local storage...');
    const defaultParams = JSON.stringify({ filtrarPorUsuario: false });
    const sparams = localStorage.getItem('papws.cc.cotizaciones.params');
    return sparams ? JSON.parse(sparams) : { filtrarPorUsuario: false };
  }

  private saveParams() {
    localStorage.setItem(
      'papws.cc.cotizaciones.params',
      JSON.stringify(this.params)
    );
  }

  loadCriteria() {
    const sdata = localStorage.getItem('papx-cotizaciones-search-criteria');
    if (sdata) {
      return JSON.parse(sdata);
    } else {
      return null;
    }
  }

  onCriteriaChanged(event: any) {
    localStorage.setItem(
      'papx-cotizaciones-search-criteria',
      JSON.stringify(event)
    );
    this.searchCriteria = event;
    this.criteria$.next(this.searchCriteria);
  }

  async deleteCriteria() {
    const al = await this.alert.create({
      mode: 'ios',
      message: 'Quitar criterio de búsqueda?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Aceptar',
          role: 'accept',
          handler: () => (this.searchCriteria = null),
        },
      ],
    });
    await al.present();
  }

  onFilter(event: string) {
    this.textFilter$.next(event);
  }

  filtrarPorUsuario(val: boolean) {
    this.filtrarPorUsuario$.next(!val);
    this.params.filtrarPorUsuario = !val;
    this.saveParams();
  }

  onSelection(event: Partial<Pedido>) {
    this.facade.setCurrent(event as Pedido);
    this.router.navigate(['', 'ventas', 'cotizaciones', event.id]);
  }

  onEdit(event: Partial<Pedido>) {
    this.facade.setCurrent(event as Pedido);
    this.router.navigate(['', 'ventas', 'cotizaciones', event.id]);
  }

  async onCopiar(event: Partial<Pedido>, user: User) {
    await this.ventasController.generarCopiaPedido(event, user);
  }

  async onCerrar(event: Partial<Pedido>, user: User) {
    const modal = await this.alert.create({
      header: 'Cerrar pedido: ' + event.folio + ' ?',
      subHeader: event.autorizacionesRequeridas
        ? 'Requiere autorización:'
        : event.nombre,
      message: event.autorizacionesRequeridas
        ? event.autorizacionesRequeridas
        : 'Para ser atendido en sucursal',
      animated: true,
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => ({ cerrar: false }),
        },
        {
          text: 'Aceptar',
          role: 'acept',
          handler: () => ({ cerrar: true }),
        },
      ],
    });
    await modal.present();
    const {
      data: { cerrar },
    } = await modal.onWillDismiss();
    if (cerrar) {
      this.pedidosFacade.cerrarPedido(event.id, event, user);
    }
  }

  getTitle(filtered: boolean) {
    return filtered ? 'Mis cotizaciones' : 'Cotizaciones';
  }
}
