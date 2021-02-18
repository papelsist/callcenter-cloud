import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'papx-cliente-field',
  template: `
    <ion-item button>
      <ion-label>
        <h2>
          {{ cliente?.nombre }}
          <ion-text color="secondary">
            <sub>({{ cliente?.rfc }})</sub>
          </ion-text>
        </h2>
        <ion-text color="danger">
          <p *ngIf="!cliente.activo">SUSPENDIDO</p>
        </ion-text>
        <p></p>
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
  @Input() parent: FormGroup;
  constructor() {}

  ngOnInit() {}

  get cliente() {
    return this.parent.get('cliente').value;
  }

  // get value() {
  //   return this.parent.get('cliente').value;
  // }
}
