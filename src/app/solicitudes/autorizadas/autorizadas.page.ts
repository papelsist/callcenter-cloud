import { Component, OnInit } from '@angular/core';
import { AuthService } from '@papx/auth';

import { SolicitudDeDeposito, UserInfo } from '@papx/models';
import { SolicitudesService } from '@papx/shared/solicitudes/@data-access/solicitudes.service';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
  throwError,
} from 'rxjs';
import { catchError, map, takeUntil, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/core';

@Component({
  selector: 'app-autorizadas',
  templateUrl: './autorizadas.page.html',
  styleUrls: ['./autorizadas.page.scss'],
})
export class AutorizadasPage implements OnInit {
  autorizadas$: Observable<SolicitudDeDeposito[]>;
  filtrar$ = new BehaviorSubject<boolean>(true);

  STORAGE_KEY = 'sx-depositos-pwa.solicitudes.autorizadas';

  constructor(private service: SolicitudesService, private auth: AuthService) {}

  ngOnInit() {
    this.loadConfig();
    this.load();
  }

  private load() {
    this.autorizadas$ = combineLatest([
      this.service.findAutorizadas(),
      this.filtrar$.pipe(tap((val) => console.log('Filtrando: ', val))),
      this.auth.user$,
    ]).pipe(
      map(([solicitudes, filtrar, user]) => {
        return filtrar
          ? solicitudes.filter((item) => item.updateUserUid === user.uid)
          : solicitudes;
      })
    );
  }

  private loadConfig() {
    const value = localStorage.getItem(this.STORAGE_KEY) || 'true';
    this.filtrar$.next(value === 'true');
  }

  filtrar(value: boolean) {
    this.filtrar$.next(!value);
    localStorage.setItem(this.STORAGE_KEY, value.toString());
  }

  private handleError(err: any) {
    console.log('Error: ');
  }
}
