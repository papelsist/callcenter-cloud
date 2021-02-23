import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'papx-tipo-pedido',
  template: `
    <ion-item [formGroup]="parent">
      <!-- <ion-label>Tipo</ion-label> -->
      <ion-select
        placeholder="Tipo"
        interface="popover"
        [formControlName]="property"
      >
        <ion-select-option [value]="t.clave" *ngFor="let t of tipos">
          {{ t.descripcion }}
        </ion-select-option>
      </ion-select>
      <ion-icon
        name="document-text"
        slot="start"
        [color]="control.valid ? 'secondary' : ''"
      ></ion-icon>
    </ion-item>
    <ion-note *ngIf="getError() as err" color="danger"> {{ err }} </ion-note>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      ion-select {
        width: 100%;
        justify-content: center;
      }
    `,
  ],
})
export class TipoDePedidoComponent {
  @Input() parent: FormGroup;
  @Input() tipos = [
    { clave: 'CON', descripcion: 'Contado' },
    { clave: 'CRE', descripcion: 'Crédito' },
    { clave: 'COD', descripcion: 'Envio (COD)' },
  ];
  @Input() property = 'tipo';
  @Input() label = 'Tipo';

  constructor() {}

  get control() {
    return this.parent.get('tipo');
  }

  getError(): string | null {
    return this.control.hasError('required') && this.parent.dirty
      ? 'Se requiere el tipo'
      : null;
  }
}
