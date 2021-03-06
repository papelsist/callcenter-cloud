import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@papx/auth';
import { ProductoService } from '@papx/shared/productos/data-access';
import { combineLatest } from 'rxjs';

import { switchMap, map } from 'rxjs/operators';
import sumBy from 'lodash-es/sumBy';

@Component({
  selector: 'app-producto-detail',
  templateUrl: './producto-detail.page.html',
  styleUrls: ['./producto-detail.page.scss'],
})
export class ProductoDetailPage implements OnInit {
  producto$ = this.route.paramMap.pipe(
    map((params) => params.get('productoId')),
    switchMap((id) => this.service.findById(id))
  );
  user$ = this.auth.user$;

  vm$ = combineLatest([this.user$, this.producto$]).pipe(
    map(([user, producto]) => ({ user, producto }))
  );

  constructor(
    private route: ActivatedRoute,
    private service: ProductoService,
    private auth: AuthService
  ) {}

  ngOnInit() {}

  getTotal(existencia: any) {
    // console.log(
    //   'Arr: ',
    //   Object.values(existencia).map((i: any) => parseFloat(i.cantidad))
    // );
    return sumBy(Object.values(existencia), (it: any) =>
      parseFloat(it.cantidad)
    );
    // return sumBy(Object.values(existencia), 'cantidad');
  }
}
