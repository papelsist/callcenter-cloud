import { Injectable } from '@angular/core';
import { AuthService } from '@papx/auth';
import { Pedido, User } from '@papx/models';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { VentasDataService } from '../ventas-data.service';

export interface PedidosState {
  current: Pedido | null;
  user: User | null;
}

let _state: PedidosState = {
  current: null,
  user: null,
};

@Injectable({ providedIn: 'root' })
export class PedidosFacade {
  private store = new BehaviorSubject<PedidosState>(_state);
  state$ = this.store.asObservable();
  current$ = this.state$.pipe(
    map((state) => state.current),
    distinctUntilChanged()
  );

  vm$ = combineLatest([this.authService.userInfo$, this.current$]).pipe(
    map(([user, pedido]) => ({ user, pedido }))
  );

  constructor(
    private authService: AuthService,
    private dataService: VentasDataService
  ) {}

  setCurrent(pedido: Pedido) {
    _state = { ..._state, current: pedido };
    this.store.next(_state);
  }

  async updatePedido(id: string, pedido: Partial<Pedido>, user: User) {
    await this.dataService.updatePedido(id, pedido, user);
  }

  async cerrarPedido(id: string, pedido: Partial<Pedido>, user: User) {
    pedido.status = pedido.autorizacionesRequeridas
      ? 'POR_AUTORIZAR'
      : 'COTIZACION';
    pedido.cerrado = new Date().toISOString();
    await this.updatePedido(id, pedido, user);
  }
}
