import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';

import { Transporte } from '@papx/models';
import { AngularFirestore } from '@angular/fire/firestore';

import sortBy from 'lodash-es/sortBy';

@Injectable({ providedIn: 'root' })
export class CatalogosService {
  private transportesUrl = 'assets/data/transportes.json';

  transportes$: Observable<Transporte[]> = this.http
    .get<Transporte[]>(this.transportesUrl)
    .pipe(
      shareReplay(),
      map((data) => sortBy(data, 'nombre')),
      catchError((error: any) => throwError(error))
    );

  constructor(private http: HttpClient, private firestore: AngularFirestore) {}
}
