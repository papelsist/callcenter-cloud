import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'papx-solicitudes-tab',
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <!-- Solicitudes pendientes -->
        <ion-tab-button tab="pendientes">
          <ion-icon name="timer"></ion-icon>
          <ion-label>Pendientes</ion-label>
          <!-- <ion-badge>6</ion-badge> -->
        </ion-tab-button>
        <!-- Solicitudes rechazadas -->
        <ion-tab-button tab="rechazadas">
          <ion-icon name="alert-circle"></ion-icon>
          <ion-label>Rechazadas</ion-label>
        </ion-tab-button>
        <!-- Solicitudes autorizadas -->
        <ion-tab-button tab="autorizadas">
          <ion-icon name="checkmark-done-circle"></ion-icon>
          <ion-label>Autorizadas</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
})
export class SolicitudesPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
