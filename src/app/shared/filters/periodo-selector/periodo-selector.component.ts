import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { PeriodoSearchCriteria } from '@papx/models';

@Component({
  selector: 'papx-periodo-selector',
  templateUrl: './periodo-selector.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeriodoSelectorComponent {
  doneText = 'Aceptar';
  cancelText = 'Cancelar';
  @Input() displayFormat = 'DD/MM/YYYY';
  @Input() pickerFormat = 'DD/MMM/YYYY';
  @Input() minuteValues = '0,15,30,45';
  fechaInicialMin = '2020-12-01';
  monthShortNames = [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic',
  ];

  @Input() criteria: PeriodoSearchCriteria;

  constructor(private modalController: ModalController) {}

  close() {
    this.modalController.dismiss();
  }

  submit() {
    this.modalController.dismiss(this.criteria);
  }
}
