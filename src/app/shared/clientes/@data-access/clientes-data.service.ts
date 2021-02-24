import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map, shareReplay, take } from 'rxjs/operators';

import { ClienteDto, Cliente } from '@papx/models';
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
}
