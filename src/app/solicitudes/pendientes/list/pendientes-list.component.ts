import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';

import {
  formatDistanceToNowStrict,
  parseISO,
  differenceInHours,
  addBusinessDays,
} from 'date-fns';
import { es } from 'date-fns/locale';

import { SolicitudDeDeposito } from '@papx/models';
import { ModalController } from '@ionic/angular';
import { SolicitudDetailModalComponent } from '@papx/shared/ui-solicitudes/solicitud-detail-modal/solicitud-detail-modal.component';

@Component({
  selector: 'papx-solicitudes-peneintes-list',
  template: `
    <ion-list>
      <ion-item
        *ngFor="let sol of solicitudes"
        detail
        button
        (click)="showDetail(sol)"
        [disabled]="disabled"
        mode="ios"
      >
        <ion-label>
          <ion-grid>
            <ion-row>
              <!-- 1 Importes -->
              <ion-col
                class="ion-text-wrap ion-text-center"
                size-sm="4"
                size-md="2"
                size-lg="2"
              >
                <ion-text color="primary">
                  <h2>{{ sol.total | currency }}</h2>
                </ion-text>
              </ion-col>

              <!-- 2 Banos -->
              <ion-col
                size-sm="4"
                size-md="2"
                size-lg="2"
                class="ion-text-wrap"
              >
                <ion-text color="secondary">
                  <h5 class="cuenta">
                    {{ sol.cuenta.descripcion }}
                    <strong> ({{ sol.cuenta.numero }}) </strong>
                  </h5>
                </ion-text>
                <h5 class="banco-origen">Origen: {{ sol.banco.nombre }}</h5>
              </ion-col>

              <!-- 3 Fechas -->
              <ion-col
                class="ion-text-wrap ion-text-center fechas"
                size-sm="4"
                size-md="2"
                size-lg="2"
              >
                <h5 class="retraso">
                  Act: {{ sol.lastUpdated | date: 'dd/MM/yyyy : HH:mm' }}
                </h5>
                <p>
                  <ion-text [color]="getRetrasoColor(sol)">
                    {{ getRetrasoLabel(sol) }}
                  </ion-text>
                </p>
              </ion-col>

              <!-- 4 Cliente -->
              <ion-col
                class="ion-hide-md-down ion-padding-start cliente"
                size-md="3"
                size-lg="3"
              >
                <h5 class="ion-text-wrap ">
                  {{ sol.cliente.nombre }}
                </h5>
              </ion-col>

              <!-- 5 Solicita -->
              <ion-col class="ion-hide-md-down" size-md="2" size-lg="3">
                <h5 class="ion-text-wrap ion-text-center solicita">
                  {{ sol.solicita }}
                </h5>
                <ion-text color="warning">
                  <h5 class="sucursal">({{ sol.sucursal }} )</h5>
                </ion-text>
              </ion-col>
            </ion-row>
          </ion-grid>
          <p *ngIf="sol.pedido as pedido">
            <ion-text color="warning"> Pedido: {{ pedido.folio }} </ion-text>
          </p>
        </ion-label>

        <ion-note slot="start" color="primary">
          {{ sol.folio }}
        </ion-note>
      </ion-item>
    </ion-list>
  `,
  styles: [
    `
      h5 {
        font-size: 0.8rem;
      }
      .cuenta {
        font-weight: bold;
      }
      .banco-origen {
        font-style: italic;
      }
      .importe {
        h2 {
          font-size: 1rem;
          font-weight: bold;
        }
      }
      .fechas {
      }
      .cliente {
      }
      .solicita {
      }
      .sucursal {
        font-size: 0.8rem;
        font-weight: bold;
        font-style: italic;
        text-align: center;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudesPendientesListComponent implements OnInit {
  @Input() solicitudes: SolicitudDeDeposito[] = [];
  @Input() disabled = false;

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  getRetraso(sol: Partial<SolicitudDeDeposito>) {
    let fecha = parseISO(sol.lastUpdated);
    if (this.isSBC(sol)) {
      fecha = addBusinessDays(fecha, 1); //addHours(fecha, 24);
    }
    const retrasoHoras = differenceInHours(new Date(), fecha);
    return retrasoHoras;
  }

  getRetrasoLabel(sol: Partial<SolicitudDeDeposito>) {
    let fecha = parseISO(sol.lastUpdated);
    const retrasoHoras = this.getRetraso(sol);
    const retraso = formatDistanceToNowStrict(fecha, {
      addSuffix: true,
      locale: es,
    });
    return retraso;
  }

  getRetrasoColor(sol: SolicitudDeDeposito) {
    const retrasoHoras = this.getRetraso(sol);
    if (retrasoHoras <= 1) {
      return 'success';
    } else if (retrasoHoras > 1 && retrasoHoras < 2) {
      return 'warning';
    } else {
      return 'danger';
    }
  }

  isSBC(sol: Partial<SolicitudDeDeposito>) {
    const sbc = sol.sbc ?? false;
    const cheque = sol.cheque;
    return cheque > 0.0 && sbc;
  }

  async showDetail(solicitud: SolicitudDeDeposito) {
    const modal = await this.modalController.create({
      component: SolicitudDetailModalComponent,
      cssClass: 'solicitud-detail-modal',
      mode: 'ios',
      componentProps: {
        solicitud,
      },
    });
    return await modal.present();
  }
}
