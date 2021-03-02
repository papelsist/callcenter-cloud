import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';

import { AngularFirestore } from '@angular/fire/firestore';

import sortBy from 'lodash-es/sortBy';
import keyBy from 'lodash-es/keyBy';
import sumBy from 'lodash-es/sumBy';
import toNumber from 'lodash-es/toNumber';

import { Producto } from '@papx/models';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  productos$ = this.firestore
    .collection<Producto>('productos', (ref) =>
      ref.where('activo', '==', true).limit(50)
    )
    .valueChanges()
    .pipe(
      // map((productos) =>
      //   productos.map((item) => {
      //     const values = Object.values(item.existencia);
      //     const disponible = sumBy(values, (r) => toNumber(r.cantidad));
      //     return { ...item, disponible };
      //   })
      // ),
      map((productos) => sortBy(productos, ['linea', 'clave'])),
      shareReplay(),
      catchError((error: any) => throwError(error))
    );
  activos$ = this.productos$.pipe(
    map((productos) => productos.filter((item) => item.activo))
  );

  productosMap$: Observable<{ [key: string]: Producto }> = this.productos$.pipe(
    map((productos) => keyBy(productos, 'id'))
  );

  constructor(private firestore: AngularFirestore) {}

  findByClave(clave: string) {
    return this.productosMap$.pipe(map((repository) => repository[clave]));
  }
  findByClaves(claves: string[]) {
    return this.productosMap$.pipe(
      map((repository) => claves.map((c) => repository[c]))
    );
  }
}
