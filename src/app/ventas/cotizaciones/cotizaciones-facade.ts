import { Injectable } from '@angular/core';
import { AuthService } from '@papx/auth';
import { UserInfo } from '@papx/models';

import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { VentasDataService } from '../@data-access';

export namespace Cotizaciones {
  export interface State {
    filterByUser: boolean;
    title: string;
    usuario: UserInfo;
    cotizaciones: any[];
    selectedCotizacion: any | null;
  }
}
let _state: Cotizaciones.State = {
  title: 'Cotizaciones',
  filterByUser: false,
  usuario: undefined,
  cotizaciones: [],
  selectedCotizacion: null,
};

@Injectable()
export class CotizacionesFacade {
  private store = new BehaviorSubject<Cotizaciones.State>(_state);

  private user$ = this.auth.userInfo$;
  public state$ = this.store.asObservable();
  /*
  public state$: Observable<Cotizaciones.State> = combineLatest([
    this.store,
    this.user$,
  ]).pipe(map(([store, user]) => ({ ...store, user })));
  */
  // Puglic properties
  filterByUser$ = this.state$.pipe(
    map((state) => state.filterByUser),
    distinctUntilChanged()
  );

  title$ = this.state$.pipe(
    map((state) => state.title),
    distinctUntilChanged()
  );
  cotizaciones$ = this.state$.pipe(
    map((state) => state.cotizaciones),
    distinctUntilChanged()
  );

  constructor(
    private dataService: VentasDataService,
    private auth: AuthService
  ) {
    combineLatest([
      auth.userInfo$,
      this.filterByUser$,
      this.dataService.cotizaciones$,
    ])
      .pipe(
        map(([usuario, filterByUser, cotizaciones]) => ({
          usuario,
          filterByUser,
          cotizaciones,
        }))
      )
      .subscribe((data) => {
        this.store.next((_state = { ..._state, ...data }));
      });
  }

  toggleFilter() {
    this.store.next({ ..._state, filterByUser: !_state.filterByUser });
  }
}
