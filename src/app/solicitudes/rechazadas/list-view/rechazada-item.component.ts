import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';

import {
  parseISO,
  formatDistanceToNowStrict,
  differenceInHours,
  addBusinessDays,
} from 'date-fns';
import es from 'date-fns/locale/es';

import { SolicitudDeDeposito } from '@papx/models';
import { ModalController } from '@ionic/angular';
import { SolicitudDetailModalComponent } from '@papx/shared/ui-solicitudes/solicitud-detail-modal/solicitud-detail-modal.component';

@Component({
  selector: 'papx-rechazada-item',
  template: `
    <ion-item-sliding>
      <ion-item-options side="end">
        <ion-item-option (click)="showDetail(sol)"
          >Detalle
          <ion-icon slot="bottom" name="information-circle"></ion-icon>
        </ion-item-option>
        <ion-item-option color="danger" (click)="eliminar.emit(sol)"
          >Eliminar
          <ion-icon slot="bottom" name="trash"></ion-icon>
        </ion-item-option>
      </ion-item-options>
      <ion-item
        detail
        button
        [routerLink]="['/', 'solicitudes', 'rechazadas', sol.id]"
        [disabled]="disabled"
        mode="ios"
      >
        <ion-label>
          <ion-grid>
            <ion-row>
              <!-- 1 Importes -->
              <ion-col
                class="ion-text-wrap ion-text-center"
                size-sm="6"
                size-md="3"
                size-lg="3"
              >
                <ion-text [color]="importeColor">
                  <h2>
                    {{ sol.total | currency }}
                  </h2>
                </ion-text>
                <ion-chip class="ion-text-center" *ngIf="sol.rechazo">
                  <ion-icon name="close-circle" color="warning"></ion-icon>
                  <ion-label
                    >Rechazo:
                    {{
                      sol.rechazo.dateCreated.toDate()
                        | date: 'dd/MM/yyyy HH:mm'
                    }}</ion-label
                  >
                </ion-chip>
              </ion-col>

              <!-- 2 Banos -->
              <ion-col
                size-sm="4"
                size-md="2"
                size-lg="2"
                class="ion-text-wrap"
              >
                <ion-text color="secondary">
                  <h5 class="cuenta ion-text-center">
                    {{ sol.cuenta.descripcion }}
                    <strong> ({{ sol.cuenta.numero }}) </strong>
                  </h5>
                </ion-text>
                <h5 class="banco-origen ion-text-center">
                  Origen: {{ sol.banco.nombre }}
                </h5>
              </ion-col>

              <!-- 3 Fechas 
            <ion-col
              class="ion-text-wrap ion-text-center fechas"
              size-sm="4"
              size-md="2"
              size-lg="2"
            >
              <h5>
                {{ sol.fechaDeposito | date: 'dd/MM/yyyy : HH:mm' }}
              </h5>
            </ion-col>
-->
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
                <h5 class="sucursal">({{ sol.sucursal }} )</h5>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-label>
        <ion-note slot="start" color="primary">
          {{ sol.folio }}
        </ion-note>
      </ion-item>
    </ion-item-sliding>
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
      .rechazo-panel {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 0.9rem;
        background-color: rgba(146, 116, 70, 0.753);
        padding: 5px;
        border-radius: 10px;
      }
      .rechazo-panel span {
        padding: 0 10px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RechazadaItemComponent implements OnInit {
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
