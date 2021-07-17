import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { VentaAcumulada } from '../../../models/venta-acumuladas';

@Component({
  selector: 'papx-acumulado-mensual-vendedor',
  template: `
    <ion-card>
      <ion-card-header>
        <ion-card-title>Ventas acumuladas</ion-card-title>
      </ion-card-header>
      <ion-card-content class="ion-no-padding">
        <papx-ventas-acumuladas-grid
          [ventas]="ventas"
        ></papx-ventas-acumuladas-grid>
      </ion-card-content>
    </ion-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcumuladoMensualVendedorComponent implements OnInit {
  @Input() ventas: VentaAcumulada[];
  constructor() {}

  ngOnInit() {}
}
