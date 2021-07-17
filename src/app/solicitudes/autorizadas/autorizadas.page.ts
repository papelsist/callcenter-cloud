import { Component, OnInit } from '@angular/core';

import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';

import isEmpty from 'lodash-es/isEmpty';
import orderBy from 'lodash-es/orderBy';

import { AuthService } from '@papx/auth';
import { SolicitudesService } from '@papx/shared/solicitudes/@data-access/solicitudes.service';
import { BaseComponent } from 'src/app/core';
import { buildPeriodoCriteria, PeriodoSearchCriteria } from '@papx/models';

@Component({
  selector: 'app-autorizadas',
  templateUrl: './autorizadas.page.html',
  styleUrls: ['./autorizadas.page.scss'],
})
export class AutorizadasPage extends BaseComponent implements OnInit {
  criteria$ = new BehaviorSubject<PeriodoSearchCriteria>(
    buildPeriodoCriteria(2, 50)
  );
  search$ = new BehaviorSubject<string>('');

  private _filtrar = new BehaviorSubject<boolean>(false);
  filtrar$ = this._filtrar.asObservable().pipe(shareReplay());

  solicitudes$ = combineLatest([
    this.criteria$,
    this.auth.userInfo$,
    this.filtrar$,
  ]).pipe(
    map(([criteria, user, filtrar]) => ({ criteria, user, filtrar })),
    switchMap(({ criteria, user, filtrar }) =>
      this.service.findAutorizadas(criteria).pipe(
        map((rows) => orderBy(rows, ['folio'], ['desc'])),
        map((rows) =>
          filtrar
            ? rows.filter((item) => item.updateUserUid === user.uid)
            : rows
        )
      )
    ),
    shareReplay(1)
  );

  filteredSolicitudes$ = combineLatest([this.search$, this.solicitudes$]).pipe(
    map(([term, solicitudes]) =>
      isEmpty(term)
        ? solicitudes
        : solicitudes.filter((item) => {
            const data =
              `${item.cliente.nombre}${item.total}${item.solicita}`.toLowerCase();
            return data.includes(term.toLowerCase());
          })
    )
  );

  vm$ = combineLatest([this.filtrar$]).pipe(map(([filtrar]) => ({ filtrar })));

  constructor(private service: SolicitudesService, private auth: AuthService) {
    super();
  }

  ngOnInit() {}

  filtrar(value: boolean) {
    this._filtrar.next(!value);
  }

  onSearch(event: string) {
    this.search$.next(event);
  }

  changeCriteria(event: PeriodoSearchCriteria) {
    this.criteria$.next(event);
  }

  getTitle(value: boolean) {
    return value ? 'Mis solicitudes autorizadas' : 'Solicitudes Autorizadas';
  }
}
