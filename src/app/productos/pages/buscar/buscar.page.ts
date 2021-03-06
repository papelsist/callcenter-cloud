import { Component, OnInit } from '@angular/core';
import { Producto } from '@papx/models';
import { ProductoService } from '@papx/shared/productos/data-access';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, startWith, withLatestFrom } from 'rxjs/operators';

import groupBy from 'lodash-es/groupBy';

@Component({
  selector: 'papx-buscar-productos',
  templateUrl: './buscar.page.html',
  styleUrls: ['./buscar.page.scss'],
})
export class BuscarPage implements OnInit {
  filter$ = new BehaviorSubject('');
  productos$ = this.service.productos$;

  filteredProducts$ = this.filter$.pipe(
    startWith(''),
    withLatestFrom(this.productos$),
    map(([term, productos]) => {
      return !term
        ? []
        : productos.filter(
            (item) =>
              item.clave.toLowerCase().includes(term.toLowerCase()) ||
              item.descripcion.toLowerCase().includes(term.toLowerCase())
          );
    })
  );

  groupByLineas$ = this.filteredProducts$.pipe(
    map((productos) => groupBy(productos, 'linea'))
  );
  constructor(private service: ProductoService) {}

  ngOnInit() {}

  onSearch({ target: { value } }: any) {
    this.filter$.next(value);
  }
}
