import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'papx-errors',
  template: `
    <ion-list class="ion-no-padding">
      <ion-list-header>
        <ion-label color="warning"> Errores </ion-label>
        <ion-button (click)="dispose()"> Cerrar </ion-button>
      </ion-list-header>
      <ion-item *ngFor="let w of errors; index as idx">
        <ion-label>
          {{ w.key }}
        </ion-label>
        <ion-icon
          slot="start"
          name="warning"
          color="danger"
          size="small"
        ></ion-icon>
      </ion-item>
    </ion-list>
  `,
  styles: [
    `
      ion-item {
        font-size: 0.9rem;
        height: 3rem;
      }
      item-list-header {
        font-size: 0.9rem;
        height: 2rem;
        --inner-border-width: 1px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorsComponent implements OnInit {
  @Input() errors: any[];
  constructor(private popover: PopoverController) {}

  ngOnInit() {}
  async dispose() {
    await this.popover.dismiss();
  }
}
