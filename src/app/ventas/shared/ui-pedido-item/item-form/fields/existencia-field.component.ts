import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

import toNumber from 'lodash-es/toNumber';
import values from 'lodash-es/values';
import max from 'lodash-es/max';

import { Producto } from '@papx/models';

@Component({
  selector: 'papx-existencia-field',
  template: `
    <ion-grid>
      <ion-row>
        <ion-col>
          <ion-item>
            <ion-label class="ion-text-start">
              <span class="ion-padding-end"> Disponible (Global): </span>
              <ion-text color="success">
                <span>
                  {{ getDisponible() | number: '1.0-0' }}
                </span>
              </ion-text>
            </ion-label>
            <ion-note color="warning" slot="end">
              Actualizado al:({{
                getDisponibleLastUpdated() | date: 'dd/MM/yyyy HH:mm'
              }})
            </ion-note>
          </ion-item>
        </ion-col>
        <ion-col *ngIf="faltante > 0">
          <ion-item>
            <ion-label color="warning" class="ion-text-wrap">
              Faltante:
              {{ faltante | number: '1.0-0' }}
            </ion-label>
          </ion-item>
        </ion-col>
      </ion-row>

      <ion-row *ngIf="existencias">
        <ion-col
          *ngFor="let item of existencias | keyvalue"
          size-md="2"
          size-sm="3"
        >
          <ion-item [ngClass]="{ active: getLabel(item.key) === sucursal }">
            <ion-label position="floating">{{ getLabel(item.key) }}</ion-label>
            <ion-input
              value="{{ item.value['cantidad'] | number: '1.0-0' }}"
              readonly
              tabindex="-99"
              [color]="getColor(item.value['cantidad'])"
            ></ion-input>
          </ion-item>
        </ion-col>
      </ion-row>
    </ion-grid>
  `,
  styles: [
    `
      .active {
        border: 1px solid #6370ff;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExistenciaFieldComponent implements OnInit {
  @Input() producto: Partial<Producto>;
  @Input() existencias;
  @Input() sucursal;
  @Input() faltante: number = 0;
  constructor() {}

  ngOnInit() {}

  getLabel(key: any) {
    if (key === 'cf5febrero') return '5 FEBRERO';
    if (key === 'vertiz176') return 'VERTIZ 176';
    if (key === 'calle4') return 'CALLE 4';
    return key.toLocaleUpperCase();
  }

  getColor(cantidad: number) {
    return cantidad > 0 ? 'success' : cantidad < 0 ? 'danger' : '';
  }

  getDisponible() {
    const disponible = Object.keys(this.existencias).reduce(
      (p, c) => p + toNumber(this.existencias[c].cantidad),
      0.0
    );
    return disponible;
  }

  getDisponibleLastUpdated() {
    if (this.existencias) {
      const ops = values(this.existencias).map((item) =>
        item.lastUpdated.toMillis()
      );
      return max(ops);
    }
  }
}
