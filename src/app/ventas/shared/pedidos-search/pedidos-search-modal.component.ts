import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { PedidosSearchCriteria } from '@papx/models';

@Component({
  selector: 'papx-pedidos-search-modal',
  templateUrl: './pedidos-search-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PedidosSearchModalComponent {
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

  @Input() criteria: PedidosSearchCriteria = {
    fechaInicial: new Date().toISOString(),
    fechaFinal: new Date().toISOString(),
    registros: 10,
  };

  constructor(private modalController: ModalController) {}

  close() {
    this.modalController.dismiss();
  }

  submit() {
    this.modalController.dismiss(this.criteria);
  }
}
