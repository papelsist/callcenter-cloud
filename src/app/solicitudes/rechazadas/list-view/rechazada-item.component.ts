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
        [disabled]="disabled"
        [routerLink]="['/', 'solicitudes', 'rechazadas', sol.id]"
      >
        <ion-text color="tertiary" slot="start">{{ sol.folio }}</ion-text>
        <ion-label>
          <div class="row-1">
            <h2>
              <ion-text [color]="importeColor">
                {{ sol.total | currency }}
              </ion-text>
            </h2>
            <h2 class="ion-text-center">Origen: {{ sol.banco.nombre }}</h2>
            <h2 class="ion-text-center">
              {{ sol.cuenta.descripcion }}({{ sol.cuenta.numero }})
            </h2>
            <h2>F. Depósito: {{ sol.fechaDeposito | date: 'dd/MM/yyyy' }}</h2>
            <span>Ref: {{ sol.referencia }}</span>
          </div>
          <p class="row-2">
            <span>{{ sol?.rechazo?.motivo }}</span>
            <span>
              Fecha: {{ sol.rechazo.dateCreated.toDate() | date: 'dd/MM/yyyy' }}
            </span>

            <span class="ion-text-wrap ">
              {{ sol.cliente.nombre }}
            </span>
            <span class="ion-text-wrap ion-text-center solicita">
              Solicita: {{ sol.solicita }}
            </span>
            <span class="sucursal">({{ sol.sucursal }} )</span>
          </p>
        </ion-label>
      </ion-item>
    </ion-item-sliding>
  `,
  styles: [
    `
      .row-1 {
        display: grid;
        align-items: center;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      }
      .row-2 {
        display: grid;
        align-items: center;
        justify-content: flex-end;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      }

      h5 {
        font-size: 0.8rem;
      }
      .cuenta {
        font-weight: bold;
      }
      .banco-origen {
        font-style: italic;
      }
      h2 {
        font-size: 1rem;
        font-weight: bold;
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
      componentProps: {
        solicitud,
      },
    });
    return await modal.present();
  }
}
