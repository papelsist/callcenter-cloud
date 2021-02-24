import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  CollectionReference,
  QueryFn,
} from '@angular/fire/firestore';

import { Pedido, User } from '@papx/models';
import { Observable, throwError } from 'rxjs';
import { AngularFireFunctions } from '@angular/fire/functions';
import { catchError } from 'rxjs/operators';

import firebase from 'firebase/app';
import { omitBy } from 'lodash-es';

type PedidoStatus =
  | 'COTIZACION'
  | 'CERRADO'
  | 'FACTURADO'
  | 'FACTURADO_TIMBRADO';

/**
 * Factory function than creates QueryFn instances specific of the status property
 * @param status Status del pedido
 */
const getFilter = (status: PedidoStatus): QueryFn => {
  return (ref: CollectionReference) =>
    ref.where('status', '==', status).orderBy('folio', 'desc').limit(10);
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
  readonly pendientes$ = this.fetchVentas('CERRADO');
  readonly facturas$ = this.fetchVentas('FACTURADO_TIMBRADO');

  constructor(
    private afs: AngularFirestore,
    private functions: AngularFireFunctions
  ) {}

  private fetchVentas(status: PedidoStatus) {
    const filter = getFilter(status);
    return this.getPedidos(filter);
  }

  private getPedidos(qf: QueryFn) {
    return this.afs
      .collection<Pedido>(this.PEDIDOS_COLLECTION, qf)
      .valueChanges({ idField: 'id' });
  }

  findById(id: string) {
    return this.afs
      .collection<Pedido>(this.PEDIDOS_COLLECTION)
      .doc(id)
      .valueChanges()
      .pipe(catchError((err) => throwError(err)));
  }

  async createPedido(pedido: Partial<Pedido>, user: User) {
    try {
      const payload = {
        ...this.cleanPedidoPayload(pedido),
        uid: user.uid,
        dateCreated: firebase.firestore.FieldValue.serverTimestamp(),
        createUser: user.displayName,
        appVersion: 2,
      };

      const folioRef = this.afs.doc('folios/pedidos').ref;
      let folio = 1;

      const pedidoRef = this.afs.collection(this.PEDIDOS_COLLECTION).doc().ref;

      return this.afs.firestore.runTransaction(async (transaction) => {
        const folioDoc = await transaction.get<any>(folioRef);
        if (!folioDoc.exists) {
          throw 'No existe folios configurados  para CALLCENTER';
        }
        const pedidosFolios = folioDoc.data();
        if (!pedidosFolios.CALLCENTER) {
          pedidosFolios.CALLCENTER = 0; // Init value
        }
        folio = pedidosFolios.CALLCENTER + 1;
        transaction
          .update(folioRef, { CALLCENTER: folio })
          .set(pedidoRef, { ...payload, folio });
        return folio;
      });
    } catch (error: any) {
      console.error('Error salvando pedido: ', error);
      throw new Error('Error salvando pedido: ' + error.message);
    }
  }

  async updatePedido(id: string, pedido: Object, user: User) {
    try {
      const payload = {
        ...this.cleanPedidoPayload(pedido),
        appVersion: 2,
        version: firebase.firestore.FieldValue.increment(1),
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
      };
      await this.afs
        .collection(this.PEDIDOS_COLLECTION)
        .doc(id)
        .update(payload);
    } catch (error: any) {
      console.error('Error actualizando: ', error);
      throw new Error('Error actualizando pedido: ' + error.message);
    }
  }

  cleanPedidoPayload(data: Object) {
    return omitBy(data, (value, _) => value == undefined || value === null);
  }
}
