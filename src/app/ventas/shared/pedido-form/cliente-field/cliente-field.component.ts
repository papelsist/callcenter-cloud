import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';

import { Cliente } from '@papx/models';

import { PcreateFacade } from '../create-form/pcreate.facade';

@Component({
  selector: 'papx-cliente-field',
  template: `
    <ion-item button [disabled]="disabled" (click)="changeCliente.emit()">
      <ion-label class="ion-text-wrap" [color]="!this.cliente ? 'warning' : ''">
        <h2>
          {{ getLabel() }}
          <ion-text color="danger" *ngIf="cliente">
            <sub *ngIf="!cliente.activo">SUSPENDIDO</sub>
          </ion-text>
        </h2>
        <p *ngIf="cliente">
          <ion-text color="secondary"> RFC: {{ cliente?.rfc }} </ion-text>
        </p>
      </ion-label>
      <ion-icon slot="start" name="people"></ion-icon>
      <ion-icon slot="end" name="search"></ion-icon>
    </ion-item>
  `,
  styles: [
    `
      .cte-field {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClienteFieldComponent implements OnInit {
  @Input() cliente: Partial<Cliente>;
  @Input() disabled: boolean = false;
  @Output() changeCliente = new EventEmitter();
  constructor() {}

  ngOnInit() {}

  getLabel() {
    return this.cliente ? `${this.cliente.nombre}` : 'Seleccione un cliente';
  }
}
