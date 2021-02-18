import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  CollectionReference,
  QueryFn,
} from '@angular/fire/firestore';

import firebaes from 'firebase/app';

import { Pedido } from '@papx/models';
import { Observable, throwError } from 'rxjs';
import { AngularFireFunctions } from '@angular/fire/functions';
import { catchError } from 'rxjs/operators';

type PedidoStatus = 'COTIZACION' | 'PENDIENTE' | 'FACTURADO';

/**
 * Factory function than creates QueryFn instances specific of the status property
 * @param status Status del pedido
 */
const getFilter = (status: PedidoStatus): QueryFn => {
  return (ref: CollectionReference) =>
    ref.where('status', '==', status).limit(50);
};

export interface VentasQueryParams {
  status?: PedidoStatus;
  userId?: string;
  desde?: string | Date;
  max: number;
}

@Injectable({ providedIn: 'root' })
export class VentasDataService {
  PEDIDOS_COLLECTION = 'pedidos';
  readonly cotizaciones$ = this.fetchVentas('COTIZACION');
  readonly pendientes$ = this.fetchVentas('PENDIENTE');
  readonly facturas$ = this.fetchVentas('COTIZACION');

  constructor(
    private afs: AngularFirestore,
    private functions: AngularFireFunctions
  ) {}

  private fetchVentas(status: PedidoStatus) {
    const filter = getFilter(status);
    return this.getPedidos(filter);
  }

  private getPedidos(qf: QueryFn) {
    return this.afs.collection<Pedido>(this.PEDIDOS_COLLECTION, qf);
  }

  fechVentas(params: VentasQueryParams) {
    return this.afs
      .collection(this.PEDIDOS_COLLECTION, (ref) => {
        let query = ref.limitToLast(params.max).orderBy('fecha');
        if (params.desde) query = ref.where('fecha', '>=', params.desde);
        if (params.status) query = query.where('status', '==', params.status);
        if (params.userId)
          query = query.where('createUserId', '==', params.userId);
        return query;
      })
      .valueChanges({ idField: 'id' });
  }

  /**
   * Create a new entity of Pedido using  firebase callable funtion
   *
   * @param data The pedido data to be saved
   */
  addPedido(data: Partial<Pedido>): Observable<Pedido> {
    const callable = this.functions.httpsCallable('addPedido');
    return callable(data).pipe(
      catchError((err) => {
        console.log('ERR desde service: ', err);
        return throwError(err);
      })
    );
  }
}
