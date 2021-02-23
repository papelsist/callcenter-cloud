import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PedidoSummary } from '@papx/models';

import capitalize from 'lodash-es/capitalize';
import words from 'lodash-es/words';
import { PcreateFacade } from '../../pcreate.facade';

@Component({
  selector: 'papx-pedido-sumary-section',
  template: `
    <ion-grid [formGroup]="parent">
      <ion-row>
        <ion-col>
          <ion-item>
            <ion-label position="floating">Uso de CFDI</ion-label>
            <ion-select
              placeholder="Seleccione el uso adecuado"
              interface="popover"
              [interfaceOptions]="cfdiPopoverOptions"
              formControlName="usoDeCfdi"
              [compareWith]="compareWith"
            >
              <ion-select-option [value]="t.clave" *ngFor="let t of usos">
                {{ t.descripcion }}
              </ion-select-option>
            </ion-select>
          </ion-item>
          <ion-note
            [style.width.%]="100"
            color="danger"
            *ngIf="parent.get('usoDeCfdi').hasError('required')"
          >
            <p>Se requiere un uso de CFDI</p>
          </ion-note>
        </ion-col>
        <ion-col>
          <ion-item>
            <ion-label position="floating">CFDI Email</ion-label>
            <ion-input
              type="email"
              formControlName="cfdiMail"
              placeholder="Email para envio de CFDI"
            ></ion-input>
          </ion-item>
        </ion-col>
      </ion-row>

      <!-- Comentario y comprador -->
      <ion-row>
        <ion-col size-sm="7" size-md="8">
          <ion-item>
            <ion-label position="floating">Comentario</ion-label>
            <ion-input
              placeholder="Comentario"
              formControlName="comentario"
            ></ion-input>
            <ion-icon name="create" slot="start"></ion-icon>
          </ion-item>
          <ion-note
            color="danger"
            class="ion-padding ion-text-end"
            [style.width.%]="100"
            *ngIf="parent.get('comentario').hasError('maxlength')"
          >
            Númer máximo de caracteres 250
          </ion-note>
        </ion-col>
        <ion-col size-sm="5" size-md="4">
          <ion-item>
            <ion-label position="floating">Comprador</ion-label>
            <ion-input
              placeholder="Comprador"
              formControlName="comprador"
            ></ion-input>
            <ion-icon name="person-circle" slot="start"></ion-icon>
          </ion-item>
          <ion-note
            color="danger"
            class="ion-padding ion-text-end"
            [style.width.%]="100"
            *ngIf="parent.get('comprador').hasError('maxlength')"
          >
            Númer máximo de caracteres 50
          </ion-note>
        </ion-col>
      </ion-row>
    </ion-grid>
    <div *ngIf="summary$ | async as summary" class="summary">
      <span class="imp"> Importe: {{ summary.importe | currency }} </span>
      <span class="imp"> Descuento: {{ summary.descuento | currency }} </span>
      <span class="imp"> Subtotal: {{ summary.subtotal | currency }} </span>
      <span class="imp"> IVA: {{ summary.impuesto | currency }} </span>
      <span class="imp"> Total: {{ summary.total | currency }} </span>
    </div>
  `,
  styles: [
    `
      .summary {
        display: grid;
        align-items: center;
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        text-align: end;
      }
      .imp {
        padding: 10px;
        margin: 5px;
        // border: 1px solid red;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumenSectionComponent implements OnInit {
  @Input() summary: PedidoSummary;
  @Input() parent: FormGroup;
  @Input() disabled = false;
  @Input() usos = [
    { clave: 'G01', descripcion: 'ADQUISICIÓN DE MERCANCIAS (G01)' },
    { clave: 'G03', descripcion: 'GASTOS EN GENERAL (G03)' },
    { clave: 'P01', descripcion: 'POR DEFINIR (P01)' },
  ];
  cfdiPopoverOptions: any = {
    header: 'Usos de CFDI',
    cssClass: 'cfdi-field',
  };
  summary$ = this.facade.summary$;
  constructor(private facade: PcreateFacade) {}

  ngOnInit() {}

  get especial() {
    return this.parent.get('descuentoEspecial').value > 0;
  }

  compareWith(objA: any, objB: any) {
    return objA && objB ? objA.clave === objB.clave : objA === objB;
  }

  setComprador({ detail: { value } }) {
    this.parent.get('comprador').patchValue(
      words(value)
        .map((i) => capitalize(i))
        .join(' '),
      { emitEvent: false }
    );
  }
}
