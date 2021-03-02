import { Injectable } from '@angular/core';
import { Cliente } from '@papx/models';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

export interface State {
  current: Cliente | null;
  currentId: string;
  clientes: Cliente[];
}

let _state = {
  current: null,
  currentId: null,
  clientes: [],
};

@Injectable({ providedIn: 'root' })
export class ClientesFacade {
  private store = new BehaviorSubject<State>(_state);
  state$ = this.store.asObservable();

  currentId$ = this.state$.pipe(
    map((state) => state.currentId),
    distinctUntilChanged()
  );

  currentCliente$ = this.state$.pipe(
    map((state) => state.current),
    distinctUntilChanged()
  );

  clientes$ = this.state$.pipe(map((state) => state.clientes));
  constructor() {}

  setCurrentCliente(cliente: Cliente) {
    _state = { ..._state, current: cliente };
    this.store.next(_state);
  }

  setClientes(clientes: Cliente[]) {
    _state = { ..._state, clientes, currentId: null };
    this.store.next(_state);
  }

  addClienteToStore(cliente: Cliente) {
    _state = { ..._state, clientes: [..._state.clientes, cliente] };
    this.store.next(_state);
  }

  setCurrentId(id: string) {
    _state = { ..._state, currentId: id };
    this.store.next(_state);
  }

  findById(id: string) {
    return this.clientes$.pipe(
      map((clientes) => clientes.find((item) => item.id === id))
    );
  }
}
