import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { AutorizacionRechazo } from '@papx/models';

import { parseISO, formatDistanceToNowStrict } from 'date-fns';

// import es from 'date-fns/locale/es';
import { es } from 'date-fns/locale';
// import format from 'date-fns/format';

@Component({
  selector: 'papx-rechazo-info',
  template: `
    <ion-item [color]="color">
      <ion-label class="ion-text-wrap">
        <p class="motivo">
          Rechazo: {{ rechazo.motivo }} /
          <span *ngIf="rechazo.comentario">
            {{ rechazo.comentario }}
          </span>
        </p>

        <p>
          Por: {{ rechazo.userName }}
          <span class="ion-padding-start">
            {{ distanceFromNow(rechazo.dateCreated.toDate().toISOString()) }}
          </span>
          <span class="ion-padding-start">{{
            rechazo.dateCreated.toDate().toISOString()
              | date: 'dd/MMM/yyyy HH:mm'
          }}</span>
        </p>
      </ion-label>
      <ion-icon name="warning" slot="start"></ion-icon>
    </ion-item>
  `,
  styles: [
    `
      .motivo {
        font-weight: bold;
        font-size: 1rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RechazoInfoComponent implements OnInit {
  @Input() rechazo: AutorizacionRechazo;
  @Input() color = 'warning';
  constructor() {}

  ngOnInit() {}

  distanceFromNow(fechaIni: string) {
    let fecha = parseISO(fechaIni);
    return formatDistanceToNowStrict(fecha, {
      addSuffix: true,
      locale: es,
    });
  }
}
