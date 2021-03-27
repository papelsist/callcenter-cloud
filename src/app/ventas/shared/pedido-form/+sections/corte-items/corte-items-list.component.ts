import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { PedidoDet } from '@papx/models';
import { PcreateFacade } from '../../create-form/pcreate.facade';

@Component({
  selector: 'papx-cortes-list',
  template: `
    <ion-list lines="full" class="ion-no-padding">
      <ion-reorder-group disabled="false" (ionItemReorder)="doReorder($event)">
        <ion-reorder *ngFor="let item of partidas; index as idx; odd as odd">
          <ion-item>
            <ion-label class="ion-text-wrap" *ngIf="item.corte as corte">
              {{ item.descripcion }}
              <span>
                {{ corte.instruccion }}
              </span>
              <small class="ion-padding-start" *ngIf="corte.limpio">
                Limpio
              </small>
              <small class="ion-padding-start" *ngIf="corte.refinado">
                Refinado
              </small>
              <p>
                <span> Cantidad: {{ corte.cantidad | number: '1.0' }} </span>
                <span class="ion-padding-start">
                  Precio: {{ corte.precio | currency }}
                </span>
              </p>
            </ion-label>
            <ion-chip slot="start" color="primary" class="clave">
              <ion-icon name="cut"></ion-icon>
              <ion-label> {{ item.clave }}</ion-label>
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

  constructor(private facade: PcreateFacade) {}

  doReorder(ev: any) {
    //console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);
    ev.detail.complete(this.partidas);
    this.facade.reordenarPartidas(ev.detail.from, ev.detail.to);
  }
}
