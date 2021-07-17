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
  selector: 'papx-autorizadas-list',
  template: ` <ion-list class="ion-no-padding" lines="full">
    <papx-autorizada-item
      [sol]="sol"
      *ngFor="let sol of solicitudes"
    ></papx-autorizada-item>
  </ion-list>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutorizadasListComponent implements OnInit {
  @Input() solicitudes: SolicitudDeDeposito[];
  @Output() selection = new EventEmitter();
  constructor() {}

  ngOnInit() {}
}
