import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { PedidosSearchCriteria } from '@papx/models';

@Component({
  selector: 'papx-ventas-header',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>
          <div class="title">
            <span>{{ title }}</span>
            <span class="periodo" *ngIf="criteria">
              {{ criteria.fechaInicial | date: 'dd/MM/yyyy' }} /
              {{ criteria.fechaFinal | date: 'dd/MM/yyyy' }}
            </span>
          </div>
        </ion-title>

        <ion-buttons slot="end">
          <ng-content></ng-content>
          <papx-ventas-filter-button
            (filter)="filter.emit(filterActivated)"
            [active]="filterActivated"
          >
          </papx-ventas-filter-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
  `,
  styles: [
    `
      .title {
        display: flex;
        justify-content: start;
        align-items: center;
      }
      .periodo {
        flex: 1 0 auto;
        text-align: center;
        font-size: 1rem;
        color: var(--ion-color-primary-tint);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VentasHeaderComponent {
  @Input() title: string = 'NO TITLE!';
  @Input() filterActivated = false;
  @Output() filter = new EventEmitter<boolean>();
  @Input() criteria: PedidosSearchCriteria;
  @Output() criteriaChange = new EventEmitter();
  constructor() {}
}
