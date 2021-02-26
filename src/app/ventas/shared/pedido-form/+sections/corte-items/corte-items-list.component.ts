import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { PedidoDet } from '@papx/models';

@Component({
  selector: 'papx-cortes-list',
  template: `
    <ion-list lines="full" class="ion-no-padding">
      <ion-reorder-group disabled="false" (ionItemReorder)="doReorder($event)">
        <ion-reorder *ngFor="let item of partidas; index as idx; odd as odd">
          <ion-item>
            <ion-label class="ion-text-wrap" *ngIf="item.corte as corte">
              {{ corte.tantos }} tantos
              <span *ngIf="corte.instruccion !== 'ESPECIAL'">
                {{ corte.instruccion }}
              </span>
              <span *ngIf="corte.instruccion === 'ESPECIAL'">
                {{ corte.instruccionEspecial }}
              </span>
              <small class="ion-padding-start">
                ({{ corte.limpio ? 'Limpio' : '' }}) ({{
                  corte.refinado ? 'Refinado' : ''
                }})
              </small>
              <p>
                <span> Cantidad: {{ corte.cantidad | number: '1.0' }} </span>
                <span class="ion-padding-start">
                  Precio: {{ corte.precio | currency }}
                </span>
              </p>
            </ion-label>
            <ion-chip slot="start" color="primary" class="clave">
              {{ item.clave }}
            </ion-chip>
            <ion-chip slot="end" color="warning">
              {{ item.corte.precio * item.corte.cantidad | currency }}
            </ion-chip>
          </ion-item>
        </ion-reorder>
      </ion-reorder-group>
    </ion-list>
  `,
  styleUrls: ['corte-items-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CorteItemsListComponent {
  @Input() partidas: Partial<PedidoDet>[] = [];
  @Input() parent: FormGroup;

  constructor() {}

  doReorder(ev: any) {
    // console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);
    // ev.detail.complete(this.partidas);
  }
}
