import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { EditSolicitudState } from './edit-solicitud-state';

@Injectable({ providedIn: 'root' })
export class ExistsSolicitudGuard implements CanActivate {
  constructor(private state: EditSolicitudState) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | Observable<boolean> {
    const solicitudId = route.paramMap.get('solicitudId');
    this.state.setCurrent(solicitudId);
    return !!solicitudId;
  }
}
