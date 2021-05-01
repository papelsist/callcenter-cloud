import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  CollectionReference,
  QueryFn,
} from '@angular/fire/firestore';

import {
  Pedido,
  PedidoAutorizacion,
  PedidosSearchCriteria,
  Status,
  User,
} from '@papx/models';
import { Observable, of, throwError } from 'rxjs';
import { AngularFireFunctions } from '@angular/fire/functions';
import { catchError, map, take } from 'rxjs/operators';

import firebase from 'firebase/app';
import omitBy from 'lodash-es/omitBy';

import { addBusinessDays, parseISO } from 'date-fns';
import { Periodo } from 'src/app/@models/periodo';

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
  readonly cotizaciones$ = this.fetchCotizacionesVigentes();
  readonly porautorizar$ = this.fetchVentas('POR_AUTORIZAR');
  readonly pendientes$ = this.fetchPendientes();

  constructor(private afs: AngularFirestore) {}

  findCotizaciones(criteria: PedidosSearchCriteria) {
    return this.afs
      .collection<Pedido>(this.PEDIDOS_COLLECTION, (ref) => {
        let query = ref.where('status', '==', 'COTIZACION');
        if (criteria) {
          const { fechaInicial, fechaFinal } = criteria;
          query = query
            .where('fecha', '>=', parseISO(fechaInicial))
            .where('fecha', '<=', parseISO(fechaFinal));
        }
        query = query.orderBy('fecha', 'desc').limit(20);
        return query;
      })
      .valueChanges({ idField: 'id' })
      .pipe(
        catchError((err) =>
          throwError('Error fetching cotizciones del usuario ' + err.message)
        )
      );
  }

  fetchCotizaciones(user: User) {
    return this.afs
      .collection<Pedido>(this.PEDIDOS_COLLECTION, (ref) =>
        ref
          .where('status', '==', 'COTIZACION2')
          .where('uid', '==', user.uid)
          .limit(50)
      )
      .valueChanges({ idField: 'id' })
      .pipe(
        catchError((err) =>
          throwError('Error fetching cotizciones del usuario ' + err.message)
        )
      );
  }

  private fetchCotizacionesVigentes() {
    console.log('Inicializando cotizaciones pendientes.....');
    const desde = addBusinessDays(new Date(), -10);
    return this.afs
      .collection<Pedido>(this.PEDIDOS_COLLECTION, (ref) =>
        ref
          .where('status', '==', 'COTIZACION')
          .where('fecha', '>=', desde)
          .orderBy('fecha', 'desc')
          .limit(5)
      )
      .valueChanges({ idField: 'id' })
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

  fetchFacturas(periodo: Periodo = Periodo.fromNow(3)) {
    return this.afs
      .collection<Pedido>(this.PEDIDOS_COLLECTION, (ref) => {
        const { fechaInicial, fechaFinal } = periodo;
        const query = ref
          .where('status', '==', 'FACTURADO_TIMBRADO')
          .orderBy('fecha', 'desc')
          .limit(1);
        return query;
      })
      .valueChanges({ idField: 'id' })
      .pipe(
        catchError((err) =>
          throwError('Error fetching cotizciones del usuario ' + err.message)
        )
      );
  }

  findById(id: string) {
    return this.afs
      .collection<Pedido>(this.PEDIDOS_COLLECTION)
      .doc(id)
      .valueChanges({ idField: 'id' })
      .pipe(catchError((err) => throwError(err)));
  }

  fetchPedido(id: string) {
    return this.afs.doc(`pedidos/${id}`).valueChanges({ idField: 'id' });
  }

  async createPedido(pedido: Partial<Pedido>, user: User) {
    try {
      const cleanData = this.cleanPedidoPayload(pedido);

      const payload: Partial<Pedido> = {
        ...cleanData,
        fecha: new Date().toISOString(),
        vigencia: addBusinessDays(new Date(), 10).toISOString(),
        dateCreated: firebase.firestore.Timestamp.now(),
        lastUpdated: firebase.firestore.Timestamp.now(),
        createUser: user.displayName,
        updateUser: user.displayName,
        createUserId: user.uid,
        appVersion: 2,
      };

      const folioRef = this.afs.doc('folios/pedidos').ref;
      let folio = 1;

      const pedidoRef = this.afs.collection(this.PEDIDOS_COLLECTION).doc().ref;

      return this.afs.firestore.runTransaction(async (transaction) => {
        const folioDoc = await transaction.get<any>(folioRef);
        const pedidosFolios = folioDoc.data() || { CALLCENTER: 0 };
        if (!pedidosFolios.CALLCENTER) {
          pedidosFolios.CALLCENTER = 0; // Init value
        }
        folio = pedidosFolios.CALLCENTER + 1;

        transaction
          .set(folioRef, { CALLCENTER: folio }, { merge: true })
          .set(pedidoRef, { ...payload, folio });
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
        uid: user.uid,
        lastUpdated: firebase.firestore.Timestamp.now(),
      };
      await this.afs
        .collection(this.PEDIDOS_COLLECTION)
        .doc(id)
        // .set(payload, { merge: false });
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
    const aut: PedidoAutorizacion = {
      comentario,
      solicita: pedido.updateUser,
      autoriza: user.displayName,
      uid: user.uid,
      dateCreated: firebase.firestore.Timestamp.now(),
    };

    const data: Partial<Pedido> = {
      status: 'CERRADO',
      autorizacion: aut,
    };
    return this.updatePedido(pedido.id, data, user);
  }

  cleanPedidoPayload(data: Partial<Pedido>) {
    if (data.descuentoEspecial === null) {
      data.descuentoEspecial = 0.0;
    }
    const res: Partial<Pedido> = omitBy(
      data,
      (value, _) => value === undefined || value === null
    );
    if (data.envio === null) res.envio = null;
    return res;
  }

  findByFolio(folio: number): Observable<Partial<Pedido>> {
    return this.afs
      .collection(this.PEDIDOS_COLLECTION, (ref) =>
        ref.where('folio', '==', folio).limit(1)
      )
      .snapshotChanges()
      .pipe(
        take(1),
        map(
          (actions) =>
            actions.map((a) => {
              const data = a.payload.doc.data() as Pedido;
              const id = a.payload.doc.id;
              return { id, ...data };
            })[0]
        ),
        catchError((error: any) => throwError(error))
      );
  }

  saveCart(state: Partial<Pedido>, uid: string) {
    return this.afs.collection('cart').doc(uid).set(state, { merge: true });
  }

  deleteCart(uid: string) {
    return this.afs.collection('cart').doc(uid).delete();
  }

  getCart(uid: string) {
    return this.afs
      .collection<Partial<Pedido>>('cart')
      .doc(uid)
      .valueChanges()
      .pipe(take(1));
  }
}
