import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { throwError } from 'rxjs';
import { catchError, shareReplay, switchMap } from 'rxjs/operators';
import { VentaAcumulada } from '../models/venta-acumuladas';

@Injectable()
export class AnalisisFacade {
  data$ = this.fs
    .ref('bi/callcenter-resumen.json')
    .getDownloadURL()
    .pipe(
      switchMap((url) => this.http.get<VentaAcumulada[]>(url)),
      shareReplay(1),
      catchError((err) => throwError('Error descargando socios ' + err.message))
    );
  constructor(private http: HttpClient, private fs: AngularFireStorage) {}
}
