import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { PedidoSummary } from '@papx/models';
import { PcreateFacade } from '../../create-form/pcreate.facade';

@Component({
  selector: 'papx-pedido-form-footer',
  template: `
    <ion-footer>
      <ion-toolbar class="ion-no-padding">
        <ion-buttons slot="start">
          <ion-button (click)="addItem()" color="primary">
            <ion-icon name="add" slot="icon-only"></ion-icon>
          </ion-button>

          <ion-button *ngIf="errors.length > 0" (click)="showErrors(errors)">
            <ion-icon name="warning-outline" color="warning" slot="icon-only">
              <ion-badge slot="start">{{ errors.length }}</ion-badge>
            </ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title class="ion-text-center" color="success">
          Total: {{ sumamry?.total | currency }}
        </ion-title>
        <ion-buttons slot="end">
          <ion-button [disabled]="canSave" (click)="save.emit()">
            <ion-icon name="save" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PedidoFormFooterComponent implements OnInit {
  @Input() errors = [];
  @Input() sumamry: PedidoSummary;
  @Input() canSave = false;
  @Output() save = new EventEmitter();

  constructor(private facade: PcreateFacade) {}

  ngOnInit() {}

  addItem() {
    this.facade.addItem();
  }

  showErrors(errors: any) {
    console.log('Errors: ', errors);
  }
}
