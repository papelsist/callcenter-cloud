import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class CodigoPostalService {
  apiUrl2 = 'https://api-sepomex.hckdrk.mx/query/info_cp';
  apiUrl = 'http://api.papelsa.mobi:8000/api/buscar-cp';
  constructor(private http: HttpClient, private afs: AngularFirestore) {}

  fetchData2(zip: string): Observable<any[]> {
    const url = `${this.apiUrl}/${zip}`;
    return this.http
      .get<any>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  fetchData3(zip: string): Observable<any[]> {
    const params = new HttpParams().set('cp', zip);
    return this.http
      .get<any>(this.apiUrl, { params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  fetchData(zip: string): Observable<any> {
    return this.afs
      .collection('codigos_postales')
      .doc(zip)
      .valueChanges()
      .pipe(
        take(1),
        catchError((error: any) => throwError(error))
      );
  }
}
