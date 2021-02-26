import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Warning } from '@papx/models';

@Component({
  selector: 'papx-warnings',
  template: `
    <ion-list class="ion-no-padding">
      <ion-list-header>
        <ion-label color="warning"> Advertencias </ion-label>
        <ion-button (click)="dispose()"> Cerrar </ion-button>
      </ion-list-header>
      <ion-item *ngFor="let w of warnings; index as idx">
        <ion-label>
          {{ w.descripcion }}
        </ion-label>
        <ion-icon
          slot="start"
          name="alert-circle"
          color="warning"
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
export class WarningsComponent implements OnInit {
  @Input() warnings: Warning[];
  constructor(private popover: PopoverController) {}

  ngOnInit() {}
  async dispose() {
    await this.popover.dismiss();
  }
}
