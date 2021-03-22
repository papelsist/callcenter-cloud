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
  selector: 'papx-autorizada-item',
  template: `
    <ion-item
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
              size-xs="12"
              size-sm="6"
              size-md="4"
              size-lg="3"
            >
              <ion-text [color]="importeColor">
                <h2>
                  {{ sol.total | currency }}
                </h2>
              </ion-text>
              <ion-chip>
                <ion-icon name="key" color="success"></ion-icon>
                <ion-label
                  >Autorizada:
                  {{
                    sol.autorizacion.fecha.toDate() | date: 'dd/MM/yyyy HH:mm'
                  }}</ion-label
                >
              </ion-chip>
            </ion-col>

            <!-- 2 Banos -->
            <ion-col
              size-xs="12"
              size-sm="6"
              size-md="4"
              size-lg="3"
              class="ion-text-wrap ion-text-center"
            >
              <ion-text color="secondary">
                <h5 class="cuenta">
                  {{ sol.cuenta.descripcion }}
                  <strong> ({{ sol.cuenta.numero }}) </strong>
                </h5>
              </ion-text>
              <h5 class="banco-origen">Origen: {{ sol.banco.nombre }}</h5>
            </ion-col>

            <!-- 3 Cliente -->
            <ion-col
              class="ion-hide-md-down ion-padding-start cliente"
              size-md="4"
              size-lg="3"
            >
              <h5 class="ion-text-wrap ">
                {{ sol.cliente.nombre }}
              </h5>
            </ion-col>

            <!-- 4 Solicita -->
            <ion-col class="ion-hide-lg-down ion-text-center" size-lg="3">
              <h5 class="ion-text-wrap  solicita">
                {{ sol.solicita }}
              </h5>
              <h5 class="sucursal">({{ sol.sucursal }} )</h5>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-label>
      <ion-note slot="start" color="primary">
        {{ sol.folio }}
      </ion-note>
    </ion-item>
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
export class AutorizadaItemComponent implements OnInit {
  @Input() sol: SolicitudDeDeposito;
  @Input() disabled = false;
  @Input() delegateDrilldown = false;
  @Output() selection = new EventEmitter<SolicitudDeDeposito>();
  @Output() editar = new EventEmitter<SolicitudDeDeposito>();
  @Output() eliminar = new EventEmitter<SolicitudDeDeposito>();
  retraso: string;
  retrasoHoras: number;
  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.updateRetraso();
  }

  updateRetraso() {
    let fecha = parseISO(this.sol.lastUpdated);
    if (this.isSBC()) {
      fecha = addBusinessDays(fecha, 1); //addHours(fecha, 24);
    }
    this.retrasoHoras = differenceInHours(new Date(), fecha);
    this.retraso = formatDistanceToNowStrict(fecha, {
      addSuffix: true,
      locale: es,
    });
    // console.log('Retraso horas:', this.retrasoHoras);
  }

  get retrasoColor() {
    if (this.retrasoHoras <= 1) {
      return 'success';
    } else if (this.retrasoHoras > 1 && this.retrasoHoras < 2) {
      return 'warning';
    } else {
      return 'danger';
    }
  }

  get importeColor() {
    return this.sol.autorizacion ? 'success' : 'tertiary';
  }

  isSBC() {
    const sbc = this.sol.sbc ?? false;
    const cheque = this.sol.cheque;
    return cheque > 0.0 && sbc;
  }

  async showDetail(solicitud: SolicitudDeDeposito) {
    if (this.disabled) return null;
    if (this.delegateDrilldown) {
      this.selection.emit(solicitud);
      return;
    }
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
