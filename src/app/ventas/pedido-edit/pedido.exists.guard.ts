import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { VentasDataService } from '../@data-access';
import { PedidosFacade } from '../@data-access/+state';

@Injectable({ providedIn: 'root' })
export class PedidoExistsGuard implements CanActivate {
  constructor(
    private dataService: VentasDataService,
    private facade: PedidosFacade
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const id = route.paramMap.get('id');
    return this.findInStore(id).pipe(map((r) => !!r));
  }

  findInStore(id: string) {
    return this.dataService.cotizaciones$.pipe(
      map((pedidos) => pedidos.find((item) => item.id == id)),
      tap((found) => this.facade.setCurrent(found))
    );
  }
}
