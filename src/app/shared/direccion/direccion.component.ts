import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Direccion } from '@papx/models';

@Component({
  selector: 'sxcc-direccion',
  template: `
    <address class="ion-text-wrap">
      Calle: {{ direccion.calle }} No ext: {{ direccion.numeroExterior }}
      <span *ngIf="direccion.numeroInterior">
        Int: {{ direccion.numeroInterior }}
      </span>
      <br />
      Colonia: {{ direccion.colonia }} <br />
      Municipio: {{ direccion.municipio }} Estado: {{ direccion.estado }}
      <br />C.P:
      {{ direccion.codigoPostal }}
    </address>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DireccionComponent implements OnInit {
  @Input() direccion: Direccion;
  constructor() {}

  ngOnInit() {}
}
