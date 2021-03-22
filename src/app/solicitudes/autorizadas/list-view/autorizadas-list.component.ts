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
  template: ` <ion-grid class="ion-no-padding">
    <ion-row>
      <ion-col size="12" size-xl="10" offset-xl="1">
        <ion-list class="ion-no-padding" lines="full">
          <papx-autorizada-item
            [sol]="sol"
            *ngFor="let sol of solicitudes"
          ></papx-autorizada-item>
        </ion-list>
      </ion-col>
    </ion-row>
  </ion-grid>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutorizadasListComponent implements OnInit {
  @Input() solicitudes: SolicitudDeDeposito[];
  @Output() selection = new EventEmitter();
  constructor() {}

  ngOnInit() {}
}
