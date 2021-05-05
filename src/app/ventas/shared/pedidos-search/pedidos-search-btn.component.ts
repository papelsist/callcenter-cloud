import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PedidosSearchCriteria } from '@papx/models';
import { Periodo } from 'src/app/@models/periodo';
import { PedidosSearchModalComponent } from './pedidos-search-modal.component';

@Component({
  selector: 'papx-pedidos-search',
  template: `
    <ion-button (click)="buildCriteria($event)" fill="clear">
      <!-- <ion-icon name="filter" slot="icon-only"></ion-icon> -->
      <ion-label>{{ label }}</ion-label>
    </ion-button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PedidosSearchComponent {
  @Input() label = 'Buscar';
  @Input() storageKey = 'papx.pedidos-search-criteria';
  @Input() criteria: PedidosSearchCriteria = {
    ...Periodo.fromNow(10).toApiJSON(),
    registros: 10,
  };
  @Output() citeriaChanged = new EventEmitter<PedidosSearchCriteria>();
  constructor(private modalController: ModalController) {}

  async buildCriteria(event: any) {
    console.log('Event: ', event);
    const modal = await this.modalController.create({
      component: PedidosSearchModalComponent,
      componentProps: {
        criteria: this.criteria,
      },
      cssClass: 'pedido-search-modal',
      mode: 'ios',
      animated: true,
      // presentingElement: event
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data) {
      this.citeriaChanged.emit(data);
    }
  }
}
