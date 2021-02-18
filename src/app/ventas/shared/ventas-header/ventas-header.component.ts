import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'papx-ventas-header',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ title }}</ion-title>
        <ion-buttons slot="end">
          <papx-ventas-filter-button
            (filter)="filter.emit($event)"
            [active]="filterActivated"
          >
          </papx-ventas-filter-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VentasHeaderComponent {
  @Input() title: string = 'NO TITLE!';
  @Input() filterActivated = false;
  @Output() filter = new EventEmitter();
  constructor() {}
}
