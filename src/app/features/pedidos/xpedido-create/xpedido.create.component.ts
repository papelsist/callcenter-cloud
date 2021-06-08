import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'papx-xpedido-create',
  template: `
    <ng-container>
      <ion-header>
        <ion-toolbar color="tertiary">
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
          </ion-buttons>
          <ion-title>Alta de pedido</ion-title>
          <ion-buttons slot="end"> </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <h1>Aqui la forma</h1>
      </ion-content>
      <ion-footer>
        <ion-toolbar>
          <ion-title>Footer</ion-title>
          <ion-buttons slot="end">
            <ion-button (click)="doCancel()">
              <ion-icon slot="start" name="arrow-back"></ion-icon>
              <ion-label>Cancelar</ion-label>
            </ion-button>
            <ion-button color="primary">
              <ion-icon name="save" slot="start"></ion-icon>
              <ion-label>Salvar</ion-label>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-footer>
    </ng-container>
  `,
})
export class XPedidoCreateComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  doCancel() {
    this.router.navigate(['ventas', 'cotizaciones']);
  }
}
