import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { AuthService } from '@papx/auth';
import { PedidosSearchCriteria } from '@papx/models';
import { VentasDataService } from '../@data-access';
import { filtrarPedidos } from '../@data-access/+state';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.page.html',
  styleUrls: ['./facturas.page.scss'],
})
export class FacturasPage {
  filtrarPorUsuario$ = new BehaviorSubject<boolean>(false);
  criteria$ = new BehaviorSubject<PedidosSearchCriteria>(null);
  searchCriteria: any = null;
  textFilter$ = new BehaviorSubject<string>('');

  vm$ = combineLatest([
    this.filtrarPorUsuario$,
    this.auth.userInfo$,
    this.criteria$,
  ]).pipe(map(([filtrar, user, criteria]) => ({ filtrar, user, criteria })));

  facturas$ = this.vm$.pipe(
    switchMap((vm) =>
      this.dataService
        .findFacturas(vm.criteria)
        .pipe(
          map((pedidos) =>
            vm.filtrar
              ? pedidos.filter((item) => item.updateUserId === vm.user.uid)
              : pedidos
          )
        )
    )
  );

  filteredFacturas$ = filtrarPedidos(this.facturas$, this.textFilter$);

  constructor(
    private dataService: VentasDataService,
    private auth: AuthService,
    private alert: AlertController
  ) {}

  filtrarPorUsuario(val: boolean) {
    this.filtrarPorUsuario$.next(!val);
  }

  onFilter(event: string) {
    this.textFilter$.next(event);
  }

  onCriteriaChanged(event: any) {
    this.criteria$.next(event);
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

  getTitle(filtered: boolean) {
    return filtered ? 'Mis facturas' : 'Facturas';
  }
}
