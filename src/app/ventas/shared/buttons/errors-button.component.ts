import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ErrorsComponent } from './errors.component';

@Component({
  selector: 'papx-errors-btn',
  template: `
    <ion-button
      (click)="showErrors($event)"
      class="badge-button"
      *ngIf="errors && errors.length"
      color="warning"
    >
      <ion-icon size="large" name="warning"> </ion-icon>
      <ion-badge
        [class.badge-one]="errors.length < 10"
        [class.badge-two]="errors.length >= 10"
        color="danger"
        >{{ errors.length }}</ion-badge
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
export class ErrorsButtonComponent implements OnInit {
  @Input() errors: any[];

  constructor(private popup: PopoverController) {}

  ngOnInit() {}

  async showErrors(ev: any) {
    const pop = await this.popup.create({
      component: ErrorsComponent,
      componentProps: {
        errors: this.errors,
      },
      cssClass: 'errors-popover-component',
      animated: true,
      event: ev,
      id: 'errors-popover',
    });
    await pop.present();
  }
}
