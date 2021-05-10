import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { SolicitudDeDeposito } from '@papx/models';

@Component({
  selector: 'papx-rechazadas-list',
  template: `
    <ion-list class="ion-no-padding" lines="full">
      <papx-rechazada-item
        [sol]="sol"
        *ngFor="let sol of solicitudes"
      ></papx-rechazada-item>
    </ion-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RechazadasListComponent implements OnInit {
  @Input() solicitudes: SolicitudDeDeposito[];
  @Output() selection = new EventEmitter();
  constructor() {}

  ngOnInit() {}
}
