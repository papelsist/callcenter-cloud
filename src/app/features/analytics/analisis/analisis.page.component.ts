import { Component, OnInit } from '@angular/core';
import { AnalisisFacade } from './analisis.facade';

@Component({
  selector: 'papx-anlytics-analisis',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Análisis de ventas</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <papx-acumulado-mensual-vendedor
        [ventas]="ventas$ | async"
      ></papx-acumulado-mensual-vendedor>
    </ion-content>
  `,
})
export class AnalisisPageComponent implements OnInit {
  ventas$ = this.facade.data$;
  constructor(private facade: AnalisisFacade) {}

  ngOnInit() {}
}
