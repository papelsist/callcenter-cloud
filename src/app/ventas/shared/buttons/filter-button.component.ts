import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'papx-ventas-filter-button',
  template: `
    <ion-button (click)="filter.emit(active)" [color]="color">
      <ion-icon name="filter" slot="icon-only"></ion-icon>
    </ion-button>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterVentasButtonComponent implements OnInit {
  @Input() active = false;
  @Output() filter = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  get color() {
    return this.active ? 'primary' : '';
  }
}
