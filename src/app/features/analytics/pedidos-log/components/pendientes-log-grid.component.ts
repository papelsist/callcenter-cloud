import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Pedido } from '@papx/models';

import { es } from 'date-fns/locale';
import { formatDistanceToNow } from 'date-fns';
import { differenceInMinutes } from 'date-fns';

@Component({
  selector: 'papx-analytics-pendientes-log-grid',
  template: `
    <ion-list>
      <ion-item *ngFor="let item of pedidos">
        <ion-label>
          <h2 class="ion-text-wrap">
            {{ item.nombre }}
          </h2>
          <p class="section">
            <span>
              <span>Fecha:</span>
              <span class="ion-padding-left"
                >{{ item.fecha.toDate() | date: 'dd/MM/yyyy' }}
              </span>
            </span>
            <span>
              <span>Modificado:</span>
              <span>{{
                item.lastUpdated.toDate() | date: 'dd/MM/yyyy HH:mm'
              }}</span>
            </span>
            <span>
              <span> Vendedor: </span>
              <span>{{ item.updateUser }}</span>
            </span>
            <span *ngIf="item.cierre && item.cierre.replicado">
              <span>Cierre:</span>
              <span>{{
                item.cierre.cerrado.toDate() | date: 'dd/MM HH:mm'
              }}</span>
            </span>
          </p>
          <p class="section" *ngIf="item.atencion as atencion">
            <span>
              <span> Sucursal: </span>
              <span>
                {{ item.sucursal }}
              </span>
            </span>
            <span>
              <span> Atiende: </span>
              <span>
                {{ atencion.atiende }}
              </span>
            </span>
            <span>
              <span>Inicio</span>
              <span>{{
                atencion.atendio.toDate() | date: 'dd-MMM(HH:mm)'
              }}</span>
            </span>
            <span>
              <ion-chip [color]="getRetraso_1_color(item)">
                Retraso1: {{ getRetraso_1(item) }} minutos
              </ion-chip>
            </span>
          </p>
          <p class="section">
            <span *ngIf="item.puesto">
              <span>Puesto</span>
              <span>{{
                item.puesto.fecha.toDate() | date: 'dd-MMM(HH:mm)'
              }}</span>
            </span>
            <span *ngIf="item.puesto">
              <span>Usuario</span>
              <span>{{ item.puesto.usuario }}</span>
            </span>
          </p>
          <ion-text color="secondary">
            <p class="section">
              <span>
                <span>Factura:</span>
                <span>{{ item?.factura?.folio }}</span>
              </span>
              <span>
                <span>UUID:</span>
                <span>{{ item?.factura?.uuid?.substr(0, 6) }}</span>
              </span>
              <span>
                <ion-chip [color]="getRetrasoFacturaColor(item)">
                  Retraso 2: {{ getRetrasoFactura(item) }} minutos
                </ion-chip>
              </span>
            </p>
          </ion-text>
        </ion-label>
        <ion-chip color="primary" slot="start">
          {{ item.folio }}
        </ion-chip>
        <ion-chip slot="end" [color]="getRetrasoGeneralColor(item)">
          {{ fromNow(item.lastUpdated.toDate()) }}
        </ion-chip>
      </ion-item>
    </ion-list>
  `,
  styleUrls: ['./pendientes-log-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PendientesLogGridComponent implements OnInit {
  @Input() pedidos: Pedido[] = [];
  constructor() {}

  ngOnInit() {}

  fromNow(date: Date) {
    return formatDistanceToNow(date, { locale: es, includeSeconds: true });
  }

  getMinutes(dateLeft: Date, dateRight: Date) {
    return differenceInMinutes(dateLeft, dateRight);
  }

  getRetrasoGeneralColor(item: Pedido) {
    const res = this.getMinutes(new Date(), item.lastUpdated.toDate());
    if (res > 120) return 'danger';
    if (res > 60) return 'warning';
    return 'success';
  }

  getRetraso_1(item: Pedido) {
    return item.atencion
      ? this.getMinutes(new Date(), item.atencion.atendio.toDate())
      : 0;
  }

  getRetraso_1_color(item: Pedido) {
    const res = this.getRetraso_1(item);
    if (res > 20) return 'danger';
    if (res > 10) return 'warning';
    return 'success';
  }

  getRetrasoFactura(item: Pedido) {
    if (item.factura) return 0;
    if (!item.atencion)
      return this.getMinutes(new Date(), item.lastUpdated.toDate());
    return item.atencion
      ? this.getMinutes(new Date(), item.atencion.facturable.toDate())
      : 0;
  }

  getRetrasoFacturaColor(item: Pedido) {
    const res = this.getRetrasoFactura(item);
    if (res > 20) return 'danger';
    if (res > 10) return 'warning';
    return 'success';
  }
}
