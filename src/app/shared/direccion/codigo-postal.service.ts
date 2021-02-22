import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CodigoPostalService {
  apiUrl = 'https://api-sepomex.hckdrk.mx/query/info_cp/37296';
  constructor(private http: HttpClient) {}

  fetchData(zip: string): Observable<any[]> {
    const url = `${this.apiUrl}/${zip}`;
    return this.http
      .get<any>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }
}
