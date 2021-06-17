import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '@papx/auth';

import { SolicitudDeDeposito, UpdateSolicitud, UserInfo } from '@papx/models';
import { SolicitudesService } from '@papx/shared/solicitudes/@data-access/solicitudes.service';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { switchMap, map, tap, shareReplay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class EditSolicitudState {
  private currentId$ = new BehaviorSubject<string | null>(null);
  currentSolicitudId$ = this.currentId$.asObservable();
  currentSolicitud$ = this.currentId$.pipe(
    switchMap((id) => {
      console.log('Fetching sol: ', id);
      return this.dataService.get(id);
    }),
    shareReplay()
  );
  title$ = this.currentSolicitud$.pipe(
    map((sol) => `Editando solicitud: ${sol.folio}`)
  );

  vm$ = combineLatest([
    this.currentSolicitud$,
    this.title$,
    this.authService.userInfo$,
  ]).pipe(map(([solicitud, title, user]) => ({ solicitud, title, user })));

  constructor(
    private afs: AngularFirestore,
    private dataService: SolicitudesService,
    private authService: AuthService
  ) {}

  setCurrent(id: string | null) {
    this.currentId$.next(id);
  }

  update(sol: Partial<SolicitudDeDeposito>, changes: any, userInfo: UserInfo) {
    if (sol.rechazo) {
      const ultimo = sol.rechazo;
      const rechasosAnteriores = sol.rechasosAnteriores ?? [];
      changes = {
        ...changes,
        rechazo: null,
        rechasosAnteriores: [...rechasosAnteriores, ultimo],
        status: 'PENDIENTE',
      };
    }
    console.log('Actualizando id: ', sol.id);
    return this.dataService.update({ id: sol.id, changes }, userInfo);
  }
}
