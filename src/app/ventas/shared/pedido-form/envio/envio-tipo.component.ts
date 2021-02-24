import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'sxcc-envio-tipo',
  template: ` <ion-item [formGroup]="parent">
    <ion-label position="floating">{{ label }}</ion-label>
    <ion-select
      placeholder="Select One"
      interface="popover"
      [formControlName]="property"
    >
      <ion-select-option [value]="t.clave" *ngFor="let t of tipos">
        {{ t.descripcion }}
      </ion-select-option>
    </ion-select>
  </ion-item>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnvioTipoComponent implements OnInit {
  @Input() parent: FormGroup;
  @Input() label = 'Tipo';
  @Input() property = 'tipo';

  tipos = [
    {
      clave: 'ENVIO',
      descripcion: 'Envio',
    },
    {
      clave: 'FORANEO',
      descripcion: 'Foraneo domicilio',
    },
    {
      clave: 'OCURRE',
      descripcion: 'Foraneo ocurre',
    },
    {
      clave: 'ENVIO_CARGO',
      descripcion: 'Envio cargo',
    },
  ];
  constructor() {}

  ngOnInit() {}
}
