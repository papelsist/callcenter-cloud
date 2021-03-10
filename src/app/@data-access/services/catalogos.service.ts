import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map, shareReplay, switchMap } from 'rxjs/operators';

import { DescuentoPorVolumen, Transporte } from '@papx/models';
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
