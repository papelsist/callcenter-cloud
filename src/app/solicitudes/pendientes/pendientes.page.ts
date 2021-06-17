import { Component, OnInit } from '@angular/core';

import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { SolicitudDeDeposito } from '@papx/models';

import { AuthService } from '@papx/auth';
import { SolicitudesService } from '@papx/shared/solicitudes/@data-access/solicitudes.service';
import { ModalController } from '@ionic/angular';
import { SolicitudDetailModalComponent } from '@papx/shared/ui-solicitudes/solicitud-detail-modal/solicitud-detail-modal.component';

@Component({
  selector: 'papx-solicitudes-pendientes',
  templateUrl: './pendientes.page.html',
  styleUrls: ['./pendientes.page.scss'],
})
export class PendientesPage implements OnInit {
  filtrar$ = new BehaviorSubject<boolean>(false);

  pendientes$ = this.service.findPendientes();

  pedidosFiltrados$ = combineLatest([
    this.pendientes$,
    this.filtrar$,
    this.authService.userInfo$,
  ]).pipe(
    map(([pendientes, filtrar, user]) =>
      filtrar
        ? pendientes.filter((item) => item.createUserUid === user.uid)
        : pendientes
    )
  );

  filtroBtnColor$: Observable<string> = this.filtrar$.pipe(
    map((value) => (value ? 'primary' : ''))
  );

  vm$ = combineLatest([
    this.filtrar$,
    this.pedidosFiltrados$,
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
    private authService: AuthService,
    private modalController: ModalController
  ) {}

  ngOnInit() {}

  filtrar(value: boolean) {
    this.filtrar$.next(!value);
  }

  async onView(solicitud: Partial<SolicitudDeDeposito>) {
    const modal = await this.modalController.create({
      component: SolicitudDetailModalComponent,
      animated: true,
    });
    await modal.present();
  }
}
