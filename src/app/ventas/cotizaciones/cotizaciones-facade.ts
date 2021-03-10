import { Injectable } from '@angular/core';
import { AuthService } from '@papx/auth';
import { Pedido, UserInfo } from '@papx/models';

import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { VentasDataService } from '../@data-access';

export namespace Cotizaciones {
  export interface State {
    filterByUser: boolean;
    title: string;
    usuario: UserInfo;
    selectedCotizacion: any | null;
  }
}
let _state: Cotizaciones.State = {
  title: 'Cotizaciones',
  filterByUser: true,
  usuario: undefined,
  selectedCotizacion: null,
};

@Injectable()
export class CotizacionesFacade {
  private store = new BehaviorSubject<Cotizaciones.State>(_state);

  public state$ = this.store.asObservable();

  constructor(
    private dataService: VentasDataService,
    private auth: AuthService
  ) {}
}
