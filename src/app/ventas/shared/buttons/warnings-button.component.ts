import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { WarningsComponent } from './warnings.component';

@Component({
  selector: 'papx-warnigs-btn',
  template: `
    <ion-button
      (click)="showWarnings($event)"
      class="badge-button"
      *ngIf="warnings && warnings.length"
      color="warning"
    >
      <!-- <ion-icon [name]="icon" slot="icon-only"> </ion-icon> -->
      <ion-icon size="large" name="notifications-circle-outline"> </ion-icon>
      <ion-badge
        [class.badge-one]="warnings.length < 10"
        [class.badge-two]="warnings.length >= 10"
        color="danger"
        >{{ warnings.length }}</ion-badge
      >
    </ion-button>
  `,
  styles: [
    `
      .badge-one {
        position: absolute;
        top: 0px;
        right: -5px;
        font-size: 0.6em;
        --padding-start: 5px;
        --padding-end: 5px;
      }

      .badge-two {
        position: absolute;
        top: 0px;
        right: -5px;
        font-size: 0.6em;
        --padding-start: 3px;
        --padding-end: 3px;
      }
    `,
  ],
})
export class WarningsButtonComponent implements OnInit {
  @Input() warnings: any[];
  @Input() icon = 'warning';
  constructor(private popup: PopoverController) {}

  ngOnInit() {}

  async showWarnings(ev: any) {
    const pop = await this.popup.create({
      component: WarningsComponent,
      componentProps: {
        warnings: this.warnings,
      },
      cssClass: 'warnings-popover-component',
      animated: true,
      event: ev,
      id: 'warnings-popover',
    });
    await pop.present();
  }
}
