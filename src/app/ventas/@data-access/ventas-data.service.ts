import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  CollectionReference,
  QueryFn,
} from '@angular/fire/firestore';

import { Pedido, PedidoDet, Status, User } from '@papx/models';
import { Observable, throwError } from 'rxjs';
import { AngularFireFunctions } from '@angular/fire/functions';
import { catchError } from 'rxjs/operators';

import firebase from 'firebase/app';
import omitBy from 'lodash-es/omitBy';
import { addDays } from 'date-fns';

/**
 * Factory function than creates QueryFn instances specific of the status property
 * @param status Status del pedido
 */
const getFilter = (status: Status): QueryFn => {
  return (ref: CollectionReference) =>
    ref.where('status', '==', status).orderBy('folio', 'desc').limit(10);
};

export interface VentasQueryParams {
  status?: Status;
  userId?: string;
  desde?: string | Date;
  max: number;
}

@Injectable({ providedIn: 'root' })
export class VentasDataService {
  PEDIDOS_COLLECTION = 'pedidos';
  readonly cotizaciones$ = this.fetchVentas('COTIZACION');
  readonly porautorizar$ = this.fetchVentas('POR_AUTORIZAR');
  readonly pendientes$ = this.fetchPendientes();
  readonly facturas$ = this.fetchVentas('FACTURADO_TIMBRADO');

  constructor(
    private afs: AngularFirestore,
    private functions: AngularFireFunctions
  ) {}

  fetchCotizaciones(user: User) {
    return this.afs
      .collection(this.PEDIDOS_COLLECTION, (ref) =>
        ref
          .where('status', '==', 'COTIZACION')
          .where('uid', '==', user.uid)
          .limit(10)
      )
      .valueChanges()
      .pipe(
        catchError((err) =>
          throwError('Error fetching cotizciones del usuario ' + err.message)
        )
      );
  }

  private fetchVentas(status: Status) {
    const filter = getFilter(status);
    return this.getPedidos(filter);
  }

  private getPedidos(qf: QueryFn) {
    return this.afs
      .collection<Pedido>(this.PEDIDOS_COLLECTION, qf)
      .valueChanges({ idField: 'id' });
  }

  private fetchPendientes() {
    return this.afs
      .collection<Pedido>('pedidos', (ref) =>
        ref
          .where('status', 'in', ['POR_AUTORIZAR'])
          .orderBy('folio', 'desc')
          .limit(20)
      )
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
      const cleanData = this.cleanPedidoPayload(pedido);
      const payload = {
        ...cleanData,
        fecha: new Date().toISOString(),
        uid: user.uid,
        vigencia: addDays(new Date(), 10).toISOString(),
        dateCreated: firebase.firestore.FieldValue.serverTimestamp(),
        createUser: user.displayName,
        appVersion: 2,
      };

      const folioRef = this.afs.doc('folios/pedidos').ref;
      let folio = 1;

      const pedidoRef = this.afs.collection(this.PEDIDOS_COLLECTION).doc().ref;

      // Stats Data
      const statsRef = this.afs
        .collection(this.PEDIDOS_COLLECTION)
        .doc('--stats--').ref;

      return this.afs.firestore.runTransaction(async (transaction) => {
        const folioDoc = await transaction.get<any>(folioRef);
        const pedidosFolios = folioDoc.data() || { CALLCENTER: 0 };
        if (!pedidosFolios.CALLCENTER) {
          pedidosFolios.CALLCENTER = 0; // Init value
        }
        folio = pedidosFolios.CALLCENTER + 1;

        transaction
          .set(folioRef, { CALLCENTER: folio }, { merge: true })
          .set(pedidoRef, { ...payload, folio })
          .set(
            statsRef,
            { count: firebase.firestore.FieldValue.increment(1) },
            { merge: true }
          );
        return folio;
      });
    } catch (error: any) {
      console.error('Error salvando pedido: ', error);
      throw new Error('Error salvando pedido: ' + error.message);
    }
  }

  async updatePedido(id: string, data: Object, user: User) {
    try {
      const cleanData = this.cleanPedidoPayload(data);
      const payload = {
        ...cleanData,
        version: firebase.firestore.FieldValue.increment(1),
        updateUser: user.displayName,
        updateUserId: user.uid,
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

  async regresarPedido(id: string, user: User) {
    const data: Partial<Pedido> = { status: 'COTIZACION' };
    return this.updatePedido(id, data, user);
  }

  async autorizarPedido(pedido: Pedido, comentario: string, user: User) {
    const aut = {
      comentario,
      fecha: new Date().toISOString(),
      solicita: pedido.updateUser,
      autoriza: user.displayName,
      uid: user.uid,
      sucursal: pedido.sucursal,
      tags: 'CALLCENTER, VENTAS',
      dateCreated: new Date().toISOString(),
    };

    const data: Partial<Pedido> = {
      status: 'CERRADO',
      autorizacion: aut,
    };
    return this.updatePedido(pedido.id, data, user);
  }

  cleanPedidoPayload(data: Object) {
    return omitBy(data, (value, _) => value === undefined || value === null);
  }
}
