import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';

import { ClienteDto, Cliente } from '@papx/models';

@Injectable({
  providedIn: 'root',
})
export class ClientesDataService {
  private clientesUrl = 'assets/data/clientes-credito.json';

  clientesCredito$: Observable<Partial<Cliente>[]> = this.http
    .get<Partial<Cliente>[]>(this.clientesUrl)
    .pipe(
      shareReplay(),
      catchError((error: any) => throwError(error))
    );

  constructor(private http: HttpClient) {}
}
