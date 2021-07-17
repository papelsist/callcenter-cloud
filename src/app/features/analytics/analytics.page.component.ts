import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'papx-analytics-page',
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="pendientes">
          <ion-icon name="timer"></ion-icon>
          <ion-label>Pendientes</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="embarques">
          <ion-icon name="airplane"></ion-icon>
          <ion-label>Tránsito</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="analisis">
          <ion-icon name="stats-chart"></ion-icon>
          <ion-label>Análisis</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
})
export class AnalyticsPageComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
