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
            <ion-label>Existencia Total:</ion-label>
            <ion-input type="number" disabled></ion-input>
          </ion-item>
        </ion-col>
      </ion-row>
      <ion-row *ngIf="existencias">
        <ion-col
          *ngFor="let item of existencias | keyvalue"
          size-md="3"
          size-sm="6"
        >
          <ion-item>
            <ion-label position="floating">{{ getLabel(item.key) }}</ion-label>
            <ion-input
              [value]="item.value['cantidad']"
              readonly
              color="success"
            ></ion-input>
          </ion-item>
        </ion-col>
      </ion-row>
    </ion-grid>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExistenciaFieldComponent implements OnInit {
  @Input() producto: Producto;
  @Input() existencias: any;
  constructor() {}

  ngOnInit() {}

  getLabel(key: string) {
    if (key === 'cf5febrero') return '5 FEBRERO';
    if (key === 'vertiz176') return 'VERTIZ 176';
    if (key === 'calle4') return 'CALLE 4';
    return key.toLocaleUpperCase();
  }
}
