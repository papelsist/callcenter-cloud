import { Injectable } from '@angular/core';
import { AuthService } from '@papx/auth';
import { Pedido, User } from '@papx/models';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { distinctUntilChanged, map, shareReplay, take } from 'rxjs/operators';
import { VentasDataService } from '../ventas-data.service';

export interface PedidosState {
  current: Pedido | null;
  user: User | null;
  cart: Partial<Pedido> | null;
}

let _state: PedidosState = {
  current: null,
  user: null,
  cart: null,
};

@Injectable({ providedIn: 'root' })
export class PedidosFacade {
  private store = new BehaviorSubject<PedidosState>(_state);
  state$ = this.store.asObservable();
  current$ = this.state$.pipe(
    map((state) => state.current),
    distinctUntilChanged()
  );

  cart$ = this.state$.pipe(
    map((state) => state.cart),
    distinctUntilChanged(),
    shareReplay(1)
  );
  userInfo$ = this.authService.userInfo$;

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

  async saveCartState(state: Partial<Pedido>, user: User) {
    await this.dataService.saveCart(state, user.uid);
  }

  getCartState(user: User) {
    return this.dataService.getCart(user.uid);
  }

  cleanCart(user: User) {
    console.log('Limpiando cart:', user.uid);
    return this.dataService.deleteCart(user.uid);
  }

  reloadCurrent(id: string) {
    this.dataService
      .findById(id)
      .pipe(take(1))
      .subscribe((c) => this.setCurrent(c));
  }

  fetchPedido(id: string) {
    return this.dataService.fetchPedido(id);
  }
}
