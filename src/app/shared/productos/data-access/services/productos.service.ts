import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { catchError, map, shareReplay, switchMap, take } from 'rxjs/operators';

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

import sortBy from 'lodash-es/sortBy';
import keyBy from 'lodash-es/keyBy';

import { Almacen, Producto } from '@papx/models';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  productos$ = this.fetchZipProducts().pipe(shareReplay());

  productosMap$: Observable<{ [key: string]: Producto }> = this.productos$.pipe(
    map((productos) => keyBy(productos, 'id'))
  );

  existencias = {};

  constructor(
    private firestore: AngularFirestore,
    private http: HttpClient,
    private fs: AngularFireStorage
  ) {}

  fetchZipProducts(): Observable<Producto[]> {
    return this.fs
      .ref('catalogos/productos-all.json')
      .getDownloadURL()
      .pipe(
        switchMap((url) => this.http.get<Producto[]>(url)),
        catchError((err) =>
          throwError('Error descargando productos ' + err.message)
        )
      );
  }

  findById(id: string) {
    return this.firestore
      .collection<Producto>('productos', (ref) =>
        ref.where('id', '==', id).limit(1)
      )
      .get()
      .pipe(
        map((snap) => (snap.empty ? null : snap.docs[0].data())),
        take(1),
        catchError((err) =>
          throwError('Error buscando producto  id: ' + err.message)
        )
      );
  }

  findByClave(clave: string) {
    return this.firestore
      .collection<Producto>('productos', (ref) =>
        ref.where('clave', '==', clave.toUpperCase()).limit(1)
      )
      .get()
      .pipe(
        map((snap) => (snap.empty ? null : snap.docs[0].data())),
        take(1),
        catchError((err) =>
          throwError('Error buscando por calve: ' + err.message)
        )
      );
  }

  fetchById(id: string) {
    return this.firestore
      .doc<Producto>(`productos/${id}`)
      .valueChanges({ idField: 'id' });
  }

  async fetchExistencia(id: string) {
    if (this.existencias[id]) {
      return this.existencias[id];
    }

    const exis = await this.firestore
      .doc<Producto>(`existencias/${id}`)
      .ref.get();
    if (exis) {
      this.existencias[id] = exis.data();
      return exis.data();
    } else {
      return {};
    }
  }
}
