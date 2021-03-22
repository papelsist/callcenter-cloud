import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SolicitudDeDeposito } from '@papx/models';

@Component({
  selector: 'papx-solicitud-detail-modal',
  template: `
    <ion-header translucent>
      <ion-toolbar class="header-toolbar2">
        <ion-title color="secondary">
          <ion-label slot="start">
            {{ solicitud.folio }}
          </ion-label>
          <span class="ion-padding-end"
            >Solicitud:
            {{ solicitud.folio }}
          </span>
          <ion-text [color]="solicitud.autorizacion ? 'success' : 'warning'">
            <span>
              {{ solicitud.status }}
            </span>
          </ion-text>
        </ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">
            <ion-label>Cerrar</ion-label>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content fullscreen>
      <!-- <ion-grid>
        <ion-row>
          <ion-col size-xs="12" size-sm="12" size-md="8" offset-md="2">
            <papx-solicitud-detail
              [solicitud]="solicitud"
            ></papx-solicitud-detail>
          </ion-col>
        </ion-row>
      </ion-grid> -->
      <papx-solicitud-detail [solicitud]="solicitud"></papx-solicitud-detail>
    </ion-content>
  `,
  styles: [
    `
      .header-toolbar {
        font-size: 80%;
        vertical-align: middle;
        --min-height: 36px !important;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudDetailModalComponent implements OnInit {
  @Input() solicitud: SolicitudDeDeposito;
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  dismiss() {
    this.modalController.dismiss();
  }
}
