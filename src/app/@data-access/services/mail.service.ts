import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of, throwError } from 'rxjs';

import { Factura, MailJet } from '@papx/models';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AngularFireFunctions } from '@angular/fire/functions';

@Injectable({ providedIn: 'root' })
export class MailService {
  constructor(private http: HttpClient, private aff: AngularFireFunctions) {}

  sendFactura(
    factura: Factura,
    nombre: string,
    target: string,
    pdfUrl: string,
    xmlUrl: string
  ) {
    // const { serie, folio, clienteNombre, target, pdfFile, xmlFile } = data;
    const { serie, folio } = factura;

    const pdf$ = this.getBlob(pdfUrl).pipe(
      switchMap((pdf) => this.getBase64AsObs(pdf))
    );

    const xml$ = this.getBlob(xmlUrl).pipe(
      switchMap((xml) => this.getBase64AsObs(xml))
    );

    return combineLatest([pdf$, xml$]).pipe(
      map(([pdfFile, xmlFile]) => ({ pdfFile, xmlFile })),
      tap((data) => console.log('Base64 data: ', data)),
      switchMap(({ pdfFile, xmlFile }) => {
        const payload = {
          serie,
          folio,
          nombre,
          target,
          pdfFile,
          xmlFile,
        };
        const callable = this.aff.httpsCallable('enviarFacturaPorMail');
        return callable(payload).pipe(catchError((err) => throwError(err)));
      }),
      catchError((err) => throwError(err))
    );

    /*
    const pdfFile = await this.getBase64(pdf);
    const xmlFile = await this.getBase64(xml);
    const payload = {
      serie, folio, nombre, target, pdfFile, xmlFile
    }
    const callable = this.aff.httpsCallable('enviarFacturaPorMail');
    return callable(payload).pipe(catchError((err) => throwError(err)));
    */
  }

  getBlob(url: string) {
    return this.http.get(url, { responseType: 'blob' });
  }

  getBase64(file: Blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  getBase64AsObs(file: Blob): Observable<string> {
    return new Observable((subs) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => subs.next(reader.result as string);
      reader.onerror = (error) => subs.error(error);
    });
  }
}
