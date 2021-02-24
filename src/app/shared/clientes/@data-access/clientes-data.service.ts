import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { combineLatest, Observable, throwError } from 'rxjs';
import { catchError, map, shareReplay, take } from 'rxjs/operators';

import { Cliente } from '@papx/models';
import { AngularFirestore } from '@angular/fire/firestore';

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
  searchClientes(term: string) {
    return combineLatest([
      this.serachByRfc(term),
      this.searchByNombre(term),
    ]).pipe(map(([b1, b2]) => [...b1, ...b2]));
  }

  searchByNombre(term: string, limit = 5) {
    return this.afs
      .collection<Cliente>('clientes', (ref) =>
        ref.where('nombre', '>=', term).orderBy('nombre', 'asc').limit(limit)
      )
      .valueChanges()
      .pipe(take(1));
  }

  serachByRfc(rfc: string) {
    // PBA0511077F9;
    return this.afs
      .collection<Cliente>('clientes', (ref) =>
        ref.where('rfc', '==', rfc.toUpperCase()).limit(2)
      )
      .valueChanges()
      .pipe(take(1));
  }
}
