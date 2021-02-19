import { Injectable } from '@angular/core';
import { Pedido, PedidoDet, Sucursal } from '@papx/models';

import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, pluck } from 'rxjs/operators';
// Temporal
import * as test from './test.data';

interface State {
  sucursal: Partial<Sucursal>;
  usuario: string;
  pedido: Partial<Pedido>;
  partidas: Partial<PedidoDet>[];
}

let _state: State = {
  sucursal: { id: '402880fc5e4ec411015e4ec64e70012e' },
  usuario: null,
  pedido: { fecha: new Date().toISOString() },
  partidas: test.TEST_PARTIDAS,
};

@Injectable()
export class PedidoCreateFacade {
  private store = new BehaviorSubject<State>(_state);
  state$ = this.store.asObservable();
  partidas$ = this.state$.pipe(pluck('partidas'), distinctUntilChanged());

  constructor() {}

  addItem(item: Partial<PedidoDet>) {
    const items = [..._state.partidas, item];
    _state = { ..._state, partidas: items };
    this.store.next(_state);
  }
}
