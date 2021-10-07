import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { combineLatest, Observable, throwError } from 'rxjs';
import { catchError, map, shareReplay, switchMap, take } from 'rxjs/operators';

import { Cliente, ClienteDto, Socio, User } from '@papx/models';
import { AngularFirestore } from '@angular/fire/firestore';

import { AngularFireStorage } from '@angular/fire/storage';
import sortBy from 'lodash-es/sortBy';
import { environment } from '@papx/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ClientesDataService {
  socios$ = this.fetchSocios().pipe(
    map((items) => sortBy(items, 'nombre')),
    shareReplay()
  );

  // clientesCache$ = this.fetchClientesCache().pipe(shareReplay());
  clientesCache$ = this.fetchClientesCache().pipe(
    map((clientes) => sortBy(clientes, 'nombre')),
    shareReplay()
  );

  constructor(
    private http: HttpClient,
    private afs: AngularFirestore,
    private fs: AngularFireStorage
  ) {}

  fetchCliente(id: string) {
    return this.afs
      .collection<Cliente>('clientes')
      .doc(id)
      .valueChanges({ idField: 'id' })
      .pipe(take(1));
  }

  fetchClientesCache(): Observable<ClienteDto[]> {
    if (environment.useEmulators) {
      return this.loadClientesFileForEmulator();
    }
    const ref = this.fs.ref('catalogos/ctes-all.json');
    return ref.getDownloadURL().pipe(
      switchMap((url) =>
        this.http.get<any[]>(url).pipe(
          map((rows) =>
            rows.map((i) => {
              const res: ClienteDto = {
                id: i.i,
                nombre: i.n,
                rfc: i.r,
                clave: i.cv,
                credito: !!i.cr,
              };
              return res;
            })
          ),
          catchError((err) =>
            throwError('Error descargando clientes ', err.message)
          )
        )
      )
    );
  }

  private loadClientesFileForEmulator() {
    const url =
      'https://firebasestorage.googleapis.com/v0/b/papx-ws-dev.appspot.com/o/catalogos%2Fctes-all.json?alt=media&token=6c6b0dfa-b3ad-4e9a-8886-431e5950b675';

    return this.http.get<any[]>(url).pipe(
      map((rows) =>
        rows.map((i) => {
          const res: ClienteDto = {
            id: i.i,
            nombre: i.n,
            rfc: i.r,
            clave: i.cv,
            credito: !!i.cr,
          };
          return res;
        })
      ),
      catchError((err) =>
        throwError('Error descargando clientes ', err.message)
      )
    );
  }

  fetchSocios(): Observable<Socio[]> {
    return this.fs
      .ref('catalogos/socios.json')
      .getDownloadURL()
      .pipe(
        switchMap((url) => this.http.get<Socio[]>(url)),
        catchError((err) =>
          throwError('Error descargando socios ' + err.message)
        )
      );
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
    console.log('Buscando cliente');
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

  serachByRfc(rfc: string, limit = 1) {
    // PBA0511077F9;
    return this.afs
      .collection<Cliente>('clientes', (ref) =>
        ref.where('rfc', '==', rfc.toUpperCase()).limit(limit)
      )
      .valueChanges()
      .pipe(take(1));
  }

  findById(id: string) {
    return this.afs
      .doc<Cliente>(`clientes/${id}`)
      .valueChanges()
      .pipe(
        take(1),
        catchError((err) =>
          throwError('Error fetching cliente from firestore ' + err.message)
        )
      );
  }

  async saveCliente(cliente: Partial<Cliente>, user: User) {

    const folioRef =  await this.afs.doc('folios/clientes').ref;
    const folioDoc = await folioRef.get();
    const folio = folioDoc.data()['CALLCENTER'];
    console.log(folio);

    const folioNew = {
      CALLCENTER: folio + 1
    };

    try {
      const id = this.afs.createId();
      const data = {
        ...cliente,
        clave: `SXCC${folio}`,
        activo: true,
        id,
        dateCreated: new Date().toISOString(),
        uid: user.uid,
        createUser: user.displayName,
        sucursal: 'CALLCENTER',
        versionApp: 2,
      };
      const docRef = this.afs
        .collection<Partial<Cliente>>('clientes')
        .doc(id).ref;
      await docRef.set(data);
      const snap = await docRef.get();
      await folioRef.set(folioNew);
      return snap.data();
      // await this.afs.collection('clientes').doc(id).set(data);
      // return id;
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
