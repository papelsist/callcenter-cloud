import { Injectable } from '@angular/core';
import { AuthService } from '@papx/auth';
import { UsuarioDto } from '@papx/models';

import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface VentasState {
  filterByUser: boolean;
  sucursalFavorita: string | null;
  usuario: UsuarioDto;
}
const _state: VentasState = {
  filterByUser: false,
  sucursalFavorita: 'CALLCENTER',
  usuario: null,
  // usuario: undefined
};

@Injectable({ providedIn: 'root' })
export class VentasFacade {
  private store = new BehaviorSubject<VentasState>(_state);
  // private state$ = this.store.asObservable();

  private filter$ = new BehaviorSubject<boolean>(false);
  private sucursal$ = new BehaviorSubject<string>('CALLE4');
  state$: Observable<VentasState> = combineLatest([
    this.filter$,
    this.sucursal$,
    this.auth.userInfo$,
  ]).pipe(
    map(([filtro, sucursal, usuario]) => ({
      filterByUser: filtro,
      sucursalFavorita: sucursal,
      usuario,
    }))
  );

  constructor(private auth: AuthService) {}

  toggleFilter(filterByUser: boolean) {
    console.log('Filter by user: ', !filterByUser);
    this.filter$.next(!filterByUser);
  }
}
