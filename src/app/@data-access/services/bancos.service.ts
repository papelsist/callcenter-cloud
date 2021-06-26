import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { catchError, map, shareReplay, switchMap, take } from 'rxjs/operators';

import { Banco, CuentaDeBanco } from '@papx/models';

import { HttpClient } from '@angular/common/http';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({ providedIn: 'root' })
export class BancosService {
  readonly bancos$ = this.fetchBancos().pipe(
    map((bancos) =>
      bancos.sort((b1, b2) =>
        b1.nombre.toLowerCase().localeCompare(b2.nombre.toLowerCase())
      )
    ),
    take(1),
    shareReplay()
  );

  readonly cuentas$ = this.fetchCuentas().pipe(
    map((bancos) =>
      bancos.sort((b1, b2) =>
        b1.descripcion.toLowerCase().localeCompare(b2.descripcion.toLowerCase())
      )
    ),
    take(1),
    shareReplay()
  );

  constructor(private http: HttpClient, private fs: AngularFireStorage) {}

  fetchCuentas(): Observable<CuentaDeBanco[]> {
    return this.fs
      .ref('catalogos/cuentas.json')
      .getDownloadURL()
      .pipe(
        switchMap((url) => this.http.get<CuentaDeBanco[]>(url)),
        catchError((err) =>
          throwError(
            'Error descargando catalogo de cuentas bancarias ' + err.message
          )
        )
      );
  }



  fetchBancos(): Observable<Banco[]> {
    return this.fs
      .ref('catalogos/bancos.json')
      .getDownloadURL()
      .pipe(
        switchMap((url) => this.http.get<Banco[]>(url)),
        catchError((err) =>
          throwError('Error descargando catalogo de bancos ' + err.message)
        )
      );
  }
}
