import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { combineLatest, Observable, throwError } from 'rxjs';
import { catchError, map, shareReplay, take } from 'rxjs/operators';

import { Cliente, User } from '@papx/models';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class ClientesDataService {
  private clientesUrl = 'assets/data/clientes-credito.json';

  clientesCredito$: Observable<Partial<Cliente>[]> = this.http
    .get<Partial<Cliente>[]>(this.clientesUrl)
    .pipe(
      shareReplay(),
      catchError((error: any) => throwError(error))
    );

  clientesCredito2$ = this.afs
    .collection<Cliente>('clientes', (ref) => ref.where('credito', '!=', false))
    .valueChanges({ idField: 'id' })
    .pipe(
      shareReplay(),
      take(1),
      catchError((error: any) => throwError(error))
    );

  constructor(private http: HttpClient, private afs: AngularFirestore) {}

  fetchCliente(id: string) {
    return this.afs
      .collection<Cliente>('clientes')
      .doc(id)
      .valueChanges({ idField: 'id' })
      .pipe(take(1));
  }

  fetchLiveCliente(id: string): Observable<Cliente> {
    return this.afs
      .collection('clientes')
      .doc(id)
      .snapshotChanges()
      .pipe(
        map((actions) => {
          const cliente = actions.payload.data() as Cliente;
          return {
            id: actions.payload.id,
            ...cliente,
          };
        })
      );
  }

  /**
   * .collection('clientes')
      .where('nombre', '>=', 'PAPELSA')
      .orderBy('nombre', 'asc')
   * @param term
   */
  searchClientes(term: string, limit = 5) {
    return combineLatest([
      this.serachByRfc(term, limit),
      this.searchByNombre(term),
    ]).pipe(map(([b1, b2]) => [...b1, ...b2]));
  }

  searchByNombre(term: string, limit = 5) {
    return this.afs
      .collection<Cliente>('clientes', (ref) =>
        ref
          .where('nombre', '>=', term.toUpperCase())
          .orderBy('nombre', 'asc')
          .limit(limit)
      )
      .valueChanges()
      .pipe(take(1));
  }

  serachByRfc(rfc: string, limit = 2) {
    // PBA0511077F9;
    return this.afs
      .collection<Cliente>('clientes', (ref) =>
        ref.where('rfc', '==', rfc.toUpperCase()).limit(limit)
      )
      .valueChanges()
      .pipe(take(1));
  }

  async saveCliente(cliente: Partial<Cliente>, user: User): Promise<string> {
    try {
      const id = this.afs.createId();
      const data = {
        ...cliente,
        dateCreated: new Date().toISOString(),
        createUserId: user.uid,
        createUser: user.displayName,
        sucursal: 'CALLCENTER',
        versionApp: 2,
      };
      await this.afs.collection('clientes').doc(id).set(data);
      return id;
    } catch (error) {
      console.error('Error: ', error.message);
      throw new Error('Error salvando cliente: ' + error.message);
    }
  }

  async updateCliente(id: string, payload: any, user: User) {
    try {
      const data = {
        ...payload,
        lastUpdated: new Date().toISOString(),
        updateUserId: user.uid,
        updateUser: user.displayName,
      };
      await this.afs.collection('clientes').doc(id).update(data);
    } catch (error) {
      console.error('Error: ', error.message);
      throw new Error('Error salvando cliente: ' + error.message);
    }
  }

  async addToFavoritos(cte: Cliente, user: User) {
    const docPath = `usuarios/${user.uid}`;
    try {
      await this.afs
        .doc(docPath)
        .collection('clientes-favoritos')
        .doc(cte.id)
        .set({ clienteId: cte.id, nombre: cte.nombre });
    } catch (error) {
      console.error('Error agregando a favoritos: ', error.message);
      throw new Error('Error agregando a favoritos' + error.message);
    }
  }
  async removeFromFavoritos(favId: string, user: User) {
    const docPath = `usuarios/${user.uid}`;
    try {
      await this.afs
        .doc(docPath)
        .collection('clientes-favoritos')
        .doc(favId)
        .delete();
    } catch (error) {
      console.error('Error agregando a favoritos: ', error.message);
      throw new Error('Error agregando a favoritos' + error.message);
    }
  }

  fetchFavoritos(user: User) {
    const docPath = `usuarios/${user.uid}`;
    return this.afs
      .doc(docPath)
      .collection('clientes-favoritos')
      .valueChanges({ idField: '' });
    // try {
    // } catch (error) {
    //   console.error('Error fetching favoritos: ', error.message);
    //   throw new Error('Error fetching favoritos ' + error.message);
    // }
  }
}
