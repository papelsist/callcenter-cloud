import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Producto } from '@papx/models';

@Component({
  selector: 'papx-existencia-field',
  template: `
    <ion-grid>
      <ion-row>
        <ion-col>
          <ion-item>
            <ion-label class="ion-text-center">
              Existencia:
              <ion-text
                [color]="getColor(producto.disponible)"
                *ngIf="producto"
              >
                {{ producto.disponible | number: '1.3-3' }}
              </ion-text>
            </ion-label>
          </ion-item>
        </ion-col>
      </ion-row>

      <ion-row *ngIf="existencias">
        <ion-col
          *ngFor="let item of existencias | keyvalue"
          size-md="3"
          size-sm="6"
        >
          <ion-item [ngClass]="{ active: getLabel(item.key) === sucursal }">
            <ion-label position="floating">{{ getLabel(item.key) }}</ion-label>
            <ion-input
              value="{{ item.value['cantidad'] | number: '1.3-3' }}"
              readonly
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
  @Input() producto: Producto;
  @Input() existencias: any;
  @Input() sucursal;
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
}
