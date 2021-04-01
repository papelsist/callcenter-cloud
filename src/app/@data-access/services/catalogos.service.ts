import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map, shareReplay, switchMap } from 'rxjs/operators';

import { DescuentoPorVolumen, Sucursal, Transporte } from '@papx/models';
import { AngularFirestore } from '@angular/fire/firestore';

import sortBy from 'lodash-es/sortBy';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({ providedIn: 'root' })
export class CatalogosService {
  transportes$: Observable<Transporte[]> = this.fetchTransportes().pipe(
    map((data) => sortBy(data, 'nombre')),
    shareReplay()
  );

  descuentos$ = this.firestore
    .collection<DescuentoPorVolumen>('descuentos_volumen')
    .valueChanges();

  readonly sucursales: Sucursal[] = [
    {
      id: '402880fc5e4ec411015e4ec64ce5012d',
      clave: '10',
      nombre: 'CALLE 4',
      label: 'Calle 4',
    },
    {
      id: '402880fc5e4ec411015e4ec64e70012e',
      clave: '12',
      nombre: 'TACUBA',
      label: 'Tacuba',
    },
    {
      id: '402880fc5e4ec411015e4ec64f460130',
      clave: '5',
      nombre: 'BOLIVAR',
      label: 'Bolivar',
    },
    {
      id: '402880fc5e4ec411015e4ec64f8e0131',
      clave: '3',
      nombre: 'ANDRADE',
      label: 'Andrade',
    },
    {
      id: '402880fc5e4ec411015e4ec650760134',
      clave: '13',
      nombre: 'CF5FEBRERO',
      label: '5 Febrero',
    },
    {
      id: '402880fc5e4ec411015e4ec6512a0136',
      clave: '2',
      nombre: 'VERTIZ 176',
      label: 'Vertiz 176',
    },
  ];

  constructor(
    private http: HttpClient,
    private fs: AngularFireStorage,
    private firestore: AngularFirestore
  ) {}

  fetchTransportes(): Observable<Transporte[]> {
    return this.fs
      .ref('catalogos/transportes.json')
      .getDownloadURL()
      .pipe(
        switchMap((url) => this.http.get<Transporte[]>(url)),
        catchError((err) =>
          throwError('Error descargando transportes ' + err.message)
        )
      );
  }
}
