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
        <ion-grid class="ion-no-padding">
          <ion-row>
            <ion-col size="12" size-md="5" size-lg="2">
              <ion-text color="primary">
                <h2>
                  {{ sol.total | currency }}
                </h2>
              </ion-text>
            </ion-col>
            <ion-col size="12" size-md="5" size-lg="2" class="ion-text-warp">
              <ion-text color="primary">
                <h2>F.Depósito:{{ sol.fechaDeposito | date: 'dd/MM/yyyy' }}</h2>
              </ion-text>
            </ion-col>

            <ion-col size="12" size-md="3" size-lg="4" class="ion-text-warp">
              <ion-text color="primary">
                <h2>{{ sol.banco.nombre }}</h2>
              </ion-text>
            </ion-col>

            <ion-col size="12" size-md="3" size-lg="4" class="ion-text-warp">
              <ion-text color="primary">
                <h2>
                  Cta:
                  {{ sol.cuenta.numero }} ({{ sol.cuenta.descripcion }})
                </h2>
              </ion-text>
            </ion-col>

            <ion-col size="12" size-md="12" size-lg="4" class="ion-text-warp">
              <h2 class="ion-text-wrap cliente">
                {{ sol.cliente.nombre }}
              </h2>
            </ion-col>

            <ion-col size="12" size-md="6" size-lg="4" class="ion-text-wrap">
              <h2 class="ion-text-wrap  solicita">
                Solicita: {{ sol.solicita }}
                <span class="sucursal">({{ sol.sucursal }} )</span>
              </h2>
            </ion-col>
            <ion-col size="12" size-lg="4" class="ion-text-end">
              <h2>
                <span class="ion-padding-right">Autorizada:</span>
                <ion-text color="success">
                  {{
                    sol.autorizacion.fecha.toDate() | date: 'dd/MM/yyyy HH:mm'
                  }}
                </ion-text>
              </h2>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-label>
      <ion-note slot="start" color="primary">
        {{ sol.folio }}
      </ion-note>
      <ion-icon
        name="checkmark-done"
        slot="end"
        [color]="sol.cobro ? 'success' : 'warning'"
      ></ion-icon>
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
        font-size: 1rem;
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
    let fecha = parseISO(this.sol.fecha);
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
