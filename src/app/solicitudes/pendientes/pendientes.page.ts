import { Component, OnInit } from '@angular/core';

import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { SolicitudDeDeposito, User, UserInfo } from '@papx/models';

import { AuthService } from '@papx/auth';
import { SolicitudesService } from '@papx/shared/solicitudes/@data-access/solicitudes.service';

@Component({
  selector: 'papx-solicitudes-pendientes',
  templateUrl: './pendientes.page.html',
  styleUrls: ['./pendientes.page.scss'],
})
export class PendientesPage implements OnInit {
  STORAGE_KEY = 'sx-depositos-pwa.solicitudes.pendientes';

  filtrar$ = new BehaviorSubject<boolean>(true);

  pendientes$ = combineLatest([this.filtrar$, this.authService.userInfo$]).pipe(
    switchMap(([filtrar, user]) =>
      filtrar
        ? this.service.findPendientesByUser(user.uid)
        : this.service.findPendientes()
    )
  );

  // pendientes$ = this.service.findAutorizadas();

  filtroBtnColor$: Observable<string> = this.filtrar$.pipe(
    map((value) => (value ? 'primary' : ''))
  );

  vm$ = combineLatest([
    this.filtrar$,
    this.pendientes$,
    this.filtroBtnColor$,
    this.authService.userInfo$,
  ]).pipe(
    map(([filtrar, pendientes, filtroColor, user]) => ({
      filtrar,
      pendientes,
      filtroColor,
      user,
    }))
  );

  constructor(
    private service: SolicitudesService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const value = localStorage.getItem(this.STORAGE_KEY) || 'true';
    this.filtrar$.next(value === 'true');
  }

  filtrar(value: boolean) {
    this.filtrar$.next(!value);
    localStorage.setItem(this.STORAGE_KEY, value.toString());
  }
}
