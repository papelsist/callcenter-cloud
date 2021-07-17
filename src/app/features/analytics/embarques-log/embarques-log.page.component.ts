import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'papx-analytics-embarques',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Embarques en proceso</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding"> </ion-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmbarquesLogPageComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
