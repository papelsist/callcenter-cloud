import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DescuentoPorVolumen } from '@papx/models';

@Component({
  selector: 'papx-descuentos-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Descuentos por volumen</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="close()">
            <ion-label>Cerrar</ion-label>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-item *ngFor="let d of descuentos; last as ls">
          <ion-grid *ngIf="!ls">
            <ion-row>
              <ion-col>De: {{ d.inicial | currency }}</ion-col>
              <ion-col>Hasta: {{ d.importe | currency }}</ion-col>
              <ion-col>{{ d.descuento / 100 | percent }}</ion-col>
            </ion-row>
          </ion-grid>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DescuentosModalComponent implements OnInit {
  @Input() descuentos: DescuentoPorVolumen[];
  constructor(private modal: ModalController) {}

  ngOnInit() {}
  async close() {
    await this.modal.dismiss();
  }
}
