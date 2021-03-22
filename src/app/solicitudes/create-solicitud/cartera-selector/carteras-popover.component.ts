import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'papx-carteras-popover',
  template: `
    <ion-list>
      <ion-list-header color="primary">Cartera</ion-list-header>
      <ion-item
        *ngFor="let c of carteras"
        button
        (click)="select(c.clave)"
        detail="false"
      >
        {{ c.descripcion }}
      </ion-item>
    </ion-list>
  `,
})
export class CarterasPopoverComponent implements OnInit {
  carteras = [
    {
      clave: 'CRE',
      descripcion: 'Crédito',
    },
    {
      clave: 'JUR',
      descripcion: 'Jurídico',
    },
    {
      clave: 'CHE',
      descripcion: 'Cheques',
    },
    {
      clave: 'CHO',
      descripcion: 'Choferes',
    },
  ];
  constructor(private popover: PopoverController) {}

  ngOnInit() {}

  async dismissPopover() {
    await this.popover.dismiss();
  }

  async select(cartera: string) {
    await this.popover.dismiss({ cartera });
  }
}
