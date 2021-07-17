import { Component, OnInit } from '@angular/core';
import { AuthService } from '@papx/auth';

import { SolicitudDeDeposito, UserInfo } from '@papx/models';
import { SolicitudesService } from '@papx/shared/solicitudes/@data-access/solicitudes.service';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { finalize, map, takeUntil, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/core';

@Component({
  selector: 'papx-solicitudes-rechazadas',
  templateUrl: './rechazadas.page.html',
  styleUrls: ['./rechazadas.page.scss'],
})
export class RechazadasPage implements OnInit {
  STORAGE_KEY = 'sx-depositos-pwa.solicitudes.rechazadas';
  solicitudes$ = this.service.rechazadas$;
  filtrar$ = new BehaviorSubject<boolean>(false);
  filtroBtnColor$: Observable<string> = this.filtrar$.pipe(
    map((value) => (value ? 'primary' : ''))
  );
  vm$ = combineLatest([
    this.filtrar$.pipe(tap((val) => console.log('FILT: ', val))),
    this.solicitudes$,
    this.filtroBtnColor$,
    this.auth.userInfo$,
  ]).pipe(
    map(([filtrar, pendientes, filtroColor, user]) => ({
      filtrar,
      pendientes,
      filtroColor,
      user,
    }))
  );

  constructor(private service: SolicitudesService, private auth: AuthService) {}

  ngOnInit() {
    const val = (localStorage.getItem(this.STORAGE_KEY) || 'true') === 'true';
    this.filtrar$.next(val);
  }

  filtrar(val: boolean) {
    this.filtrar$.next(val);
    localStorage.setItem(this.STORAGE_KEY, val.toString());
  }
}
