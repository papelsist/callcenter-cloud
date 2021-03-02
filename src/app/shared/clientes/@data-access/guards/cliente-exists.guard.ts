import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ClientesFacade } from '../+state/clientes.facade';
import { ClientesDataService } from '../clientes-data.service';

@Injectable({ providedIn: 'root' })
export class ClienteExistsGuard implements CanActivate {
  constructor(
    private store: ClientesFacade,
    private service: ClientesDataService
  ) {}

  canActivate(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get('clienteId');
    this.store.setCurrentId(id);
    /*
    return this.checkInStore(id).pipe(
      switchMap((val) => {
        if (!val) {
          return this.checkInFirebase(id);
        } else {
          return of(true);
        }
      })
    );
    */
    return true;
  }

  checkInStore(id: string) {
    return this.store.findById(id).pipe(map((found) => !!found));
  }

  checkInFirebase(id: string) {
    return this.service.fetchLiveCliente(id).pipe(
      tap((found) => {
        this.store.setCurrentCliente(found);
        this.store.addClienteToStore(found);
      }),
      map((found) => !!found)
    );
  }
}
