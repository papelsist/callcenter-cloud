import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map, shareReplay, switchMap } from 'rxjs/operators';

import { DescuentoPorVolumen, Sucursal, Transporte } from '@papx/models';
import { AngularFirestore } from '@angular/fire/firestore';

import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({ providedIn: 'root' })
export class CatalogosService {
  descuentos$ = this.firestore
    .collection<DescuentoPorVolumen>('descuentos_volumen')
    .valueChanges();

  readonly sucursales: Sucursal[] = [
    {
      id: '402880fc5e4ec411015e4ec64f8e0131',
      clave: '3',
      nombre: 'ANDRADE',
      label: 'Andrade',
      sort: 1,
    },
    {
      id: '402880fc5e4ec411015e4ec64f460130',
      clave: '5',
      nombre: 'BOLIVAR',
      label: 'Bolivar',
      sort: 10,
    },
    {
      id: '402880fc5e4ec411015e4ec64ce5012d',
      clave: '10',
      nombre: 'CALLE 4',
      label: 'Calle 4',
      sort: 20,
    },
    {
      id: '402880fc5e4ec411015e4ec64e70012e',
      clave: '12',
      nombre: 'TACUBA',
      label: 'Tacuba',
      sort: 25,
    },

    {
      id: '402880fc5e4ec411015e4ec650760134',
      clave: '13',
      nombre: 'CF5FEBRERO',
      label: '5 Febrero',
      sort: 30,
    },
    {
      id: '402880fc5e4ec411015e4ec6512a0136',
      clave: '2',
      nombre: 'VERTIZ 176',
      label: 'Vertiz 176',
      sort: 35,
    },
    {
      id: '402880fc5e4ec411015e4ec64161012c',
      clave: '1',
      nombre: 'OFICINAS',
      label: 'Oficinas',
      sort: 0,
    },
  ];

  constructor(
    private http: HttpClient,
    private fs: AngularFireStorage,
    private firestore: AngularFirestore
  ) {}

  getSucursalByName(nombre: string): Sucursal {
    return this.sucursales.find((item) => item.nombre === nombre);
  }
}
