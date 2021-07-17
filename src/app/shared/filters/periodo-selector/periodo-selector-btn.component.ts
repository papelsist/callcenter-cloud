import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ModalController } from '@ionic/angular';

import { Periodo, PeriodoSearchCriteria } from 'src/app/@models/periodo';
import { PeriodoSelectorComponent } from './periodo-selector.component';

@Component({
  selector: 'papx-periodo-selector-btn',
  template: `
    <ion-button (click)="buildCriteria($event)" fill="clear">
      <ion-icon name="calendar" slot="icon-only"></ion-icon>
      <!-- <ion-label>
        {{ criteria.fechaInicial }} -
        {{ criteria.fechaFinal }}
      </ion-label> -->
    </ion-button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeriodoSelectorBtnComponent {
  @Input() label = 'Buscar';
  @Input() criteria: PeriodoSearchCriteria = {
    ...Periodo.fromNow(10).toApiJSON(),
    registros: 10,
  };
  @Output() citeriaChanged = new EventEmitter<PeriodoSearchCriteria>();
  constructor(private modalController: ModalController) {}

  async buildCriteria(event: any) {
    const modal = await this.modalController.create({
      component: PeriodoSelectorComponent,
      componentProps: {
        criteria: this.criteria,
      },
      cssClass: 'periodo-selector-modal',
      animated: true,
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.citeriaChanged.emit(data);
    }
  }
}
