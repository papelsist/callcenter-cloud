import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SolicitudDeDeposito, UpdateSolicitud, UserInfo } from '@papx/models';

import { EditSolicitudState } from './edit-solicitud-state';

@Component({
  selector: 'app-edit-solicitud',
  templateUrl: './edit-solicitud.page.html',
  styleUrls: ['./edit-solicitud.page.scss'],
})
export class EditSolicitudPage implements OnInit {
  vm$ = this.state.vm$;
  constructor(private state: EditSolicitudState, private router: Router) {}

  ngOnInit() {}

  async onSave(sol: SolicitudDeDeposito, changes: any, userInfo: UserInfo) {
    await this.state.update(sol, changes, userInfo);
    this.router.navigate(['/', 'solicitudes', 'pendientes']);
  }
}
