import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Pedido } from '@papx/models';
import { Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';
import { VentasDataService } from '../@data-access';

@Injectable({ providedIn: 'root' })
export class PedidoResolver implements Resolve<Pedido> {
  constructor(private service: VentasDataService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const id = route.paramMap.get('id');
    console.log('Resolver goes with id: ', id);
    const pedido = this.service.fetchPedido(id).pipe(take(1));
    //  return pedido;
    return pedido;
  }
}
