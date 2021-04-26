import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Almacen, Producto } from '@papx/models';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ExistenciasService {
  private store: { [key: string]: any } = {};

  existencias$ = this.afs
    .collection('existencias')
    .stateChanges(['modified'])
    .pipe(
      map((actions) =>
        actions.map((a) => {
          const data: any = a.payload.doc.data();
          const id = a.payload.doc.id;
          const { _clave, _descripcion, ...rest } = data;
          return { id, ...rest };
        })
      ),
      tap((rows) => rows.forEach((item) => (this.store[item.id] = item)))
    );

  constructor(private afs: AngularFirestore) {}

  async fetchExistencia(id: string) {
    const prod = await this.afs.doc<Producto>(`productos/${id}`).ref.get();
    if (prod.exists) {
      return prod.data().existencia ?? {};
    } else {
      return {};
    }
  }

  getById(id: string): Observable<any> {
    return this.afs.doc(`existencias/${id}`).valueChanges();
  }
}
