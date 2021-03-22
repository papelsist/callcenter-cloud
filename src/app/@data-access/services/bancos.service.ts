import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map, shareReplay, take } from 'rxjs/operators';

import { Banco, CuentaDeBanco } from '@papx/models';

import { HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient) {}

  fetchCuentas(): Observable<CuentaDeBanco[]> {
    const url =
      'https://firebasestorage.googleapis.com/v0/b/papx-ws-dev.appspot.com/o/catalogos%2Fcuentas.json?alt=media&token=01fd457f-d287-4e98-84c4-527adcf2b32d';
    return this.http.get<CuentaDeBanco[]>(url);
  }

  fetchBancos(): Observable<Banco[]> {
    const url =
      'https://firebasestorage.googleapis.com/v0/b/papx-ws-dev.appspot.com/o/catalogos%2Fbancos.json?alt=media&token=b022e8d6-67e3-4ee0-962f-dbcba74d8aa0';
    return this.http.get<Banco[]>(url);
  }
}
