import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { VentasDataService } from '../@data-access';
import { PedidosFacade } from '../@data-access/+state';

@Injectable({ providedIn: 'root' })
export class PedidoExistsGuard implements CanActivate {
  constructor(
    private dataService: VentasDataService,
    private facade: PedidosFacade
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log('CanActivate running.....');
    const id = route.paramMap.get('id');
    // return this.findInStoreOld(id);
    const res = this.findInStore(id).pipe(
      map((r) => {
        const existe = !!r;
        console.log('Existe: ', existe);
        return existe;
      })
    );
    // return true;
    return res;
  }

  findInStore(id: string): Observable<boolean> {
    return this.facade.current$.pipe(
      tap((found) => {
        if (!found) {
          // Side effect to reload
          this.facade.reloadCurrent(id);
        }
      }),
      map((found) => found !== null),
      filter((found) => found)
    );
  }

  findInStoreOld(id: string) {
    return this.dataService.cotizaciones$.pipe(
      map((pedidos) => pedidos.find((item) => item.id == id)),
      tap((found) => console.log('Found: ', found)),
      tap((found) => this.facade.setCurrent(found))
    );
  }
}
