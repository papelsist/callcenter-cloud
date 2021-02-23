import { Injectable } from '@angular/core';
import { Pedido, PedidoDet, Sucursal } from '@papx/models';

import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, pluck } from 'rxjs/operators';

interface State {
  sucursal: Partial<Sucursal>;
  usuario: string;
  pedido: Partial<Pedido>;
}

let _state: State = {
  sucursal: { id: '402880fc5e4ec411015e4ec64e70012e' },
  usuario: null,
  pedido: {},
};

@Injectable()
export class PedidoCreateFacade {
  private store = new BehaviorSubject<State>(_state);
  state$ = this.store.asObservable();
  partidas$ = this.state$.pipe(pluck('partidas'), distinctUntilChanged());

  constructor() {}
}
