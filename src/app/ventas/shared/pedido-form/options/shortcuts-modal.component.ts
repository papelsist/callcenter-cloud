import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'papx-shortcuts-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Accesos rápidos</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="close()">
            <ion-label>Cerrar</ion-label>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-list>
        <ion-item *ngFor="let d of options; last as ls">
          <ion-label>
            {{ d.label }}
          </ion-label>
          <ion-chip slot="end" color="warning"> {{ d.key }} </ion-chip>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShortcutsModalComponent implements OnInit {
  options = [
    {
      label: 'Insertar partida',
      key: 'Ins',
    },
    {
      label: 'Insertar partida Mac',
      key: 'Command  + I',
    },
    {
      label: 'Mostrar descuentos',
      key: 'Ctrl + d',
    },
    {
      label: 'Alta de cliente',
      key: 'Ctrl + a',
    },
    {
      label: 'Salvar pedido',
      key: 'Ctrl + Shift + s',
    },
  ];

  constructor(private controller: PopoverController) {}

  ngOnInit() {}
  async close() {
    await this.controller.dismiss();
  }
}
