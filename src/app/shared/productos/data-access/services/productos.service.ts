import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';

import { AngularFirestore } from '@angular/fire/firestore';

import sortBy from 'lodash-es/sortBy';
import keyBy from 'lodash-es/keyBy';
import { Producto } from '@papx/models';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  productos$ = this.firestore
    .collection<Producto>('productos', (ref) =>
      ref.where('linea', '==', 'BOND').limit(10)
    )
    .valueChanges()
    .pipe(
      map((productos) => sortBy(productos, 'linea')),
      shareReplay(),
      catchError((error: any) => throwError(error))
    );
  activos$ = this.productos$.pipe(
    map((productos) => productos.filter((item) => item.activo))
  );

  productosMap$: Observable<{ [key: string]: Producto }> = this.productos$.pipe(
    map((productos) => keyBy(productos, 'clave'))
  );

  constructor(private firestore: AngularFirestore) {}
}
