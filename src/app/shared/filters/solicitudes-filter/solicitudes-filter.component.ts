import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { ModalController } from '@ionic/angular';

import { SolicitudesFilterModalComponent } from './solicitudes-filter-modal.component';

@Component({
  selector: 'papx-solicitudes-filter',
  template: `
    <ion-button (click)="filtrar()">
      <ion-icon
        name="filter"
        slot="icon-only"
        [color]="filter ? 'primary' : ''"
      ></ion-icon>
    </ion-button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudesFilterComponent implements OnInit {
  @Output() search = new EventEmitter();
  @Input() filter: any = {};
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  async filtrar() {
    const modal = await this.modalController.create({
      component: SolicitudesFilterModalComponent,
      componentProps: {
        filter: this.filter,
      },
      cssClass: 'solicitudes-filter-modal',
      mode: 'ios',
      animated: true,
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    this.search.emit(data);
  }
}
