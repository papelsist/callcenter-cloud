import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'papx-instruccion-field',
  template: `
    <ion-item [formGroup]="parent">
      <ion-label position="floating">Instrucción de corte</ion-label>
      <ion-select
        placeholder="Tipo de corte"
        formControlName="instruccion"
        interface="popover"
      >
        <ion-select-option *ngFor="let tipo of tipos" [value]="tipo">{{
          tipo
        }}</ion-select-option>
      </ion-select>
    </ion-item>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstruccionFieldComponent implements OnInit {
  @Input() parent: FormGroup;
  @Input() property = 'instruccion';

  @Input() tipos = [
    'CARTA',
    'OFICIO',
    '***',
    'MITAD',
    'CRUZ',
    'CROQUIS',
    'DOBLE CARTA',
    '1/8',
    '1/9',
    'ESPECIAL',
  ];

  constructor() {}

  ngOnInit() {}
}
