import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { Pedido } from '@papx/models';
import { PendientesLogTableComponent } from './components';
import { PedidosLogFacade } from './pedidos-log.facade';

@Component({
  selector: 'papx-pedidos-log-page',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button [disabled]="tipo === 'list'" (click)="toggleView('list')">
            <ion-icon slot="icon-only" name="list"></ion-icon>
          </ion-button>
          <ion-button [disabled]="tipo === 'grid'" (click)="toggleView('grid')">
            <ion-icon slot="icon-only" name="grid"></ion-icon>
          </ion-button>
          <ion-button *ngIf="tipo === 'grid'" (click)="exportGrid()">
            <ion-icon name="download" slot="icon-only"></ion-icon>
          </ion-button>
          <ng-container *ngIf="pedidos$ | async as pedidos">
            <ion-button *ngIf="tipo === 'grid'" (click)="updateStatus(pedidos)">
              <ion-icon name="refresh" slot="start"></ion-icon>
              <ion-label>Actualizar</ion-label>
            </ion-button>
          </ng-container>
        </ion-buttons>
        <ion-title>Pedidos en proceso</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <papx-pedidos-log-grid
        #gridTable
        *ngIf="tipo === 'grid'; else list"
        [pedidos]="pedidos$ | async"
      ></papx-pedidos-log-grid>

      <ng-template #list>
        <papx-analytics-pendientes-log-resumen></papx-analytics-pendientes-log-resumen>
        <papx-analytics-pendientes-log-grid
          [pedidos]="pedidos$ | async"
        ></papx-analytics-pendientes-log-grid>
      </ng-template>
    </ion-content>
  `,
})
export class PedidosLogPageComponent implements OnInit {
  pedidos$ = this.facade.pendientes$;
  tipo: string;
  private skey = 'papx-callcenter-pedidos-log-view';
  @ViewChild(PendientesLogTableComponent)
  gridTable: PendientesLogTableComponent;
  constructor(
    private facade: PedidosLogFacade,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.tipo = localStorage.getItem(this.skey) || 'grid';
  }

  toggleView(value: 'grid' | 'list') {
    this.tipo = value;
    localStorage.setItem(this.skey, this.tipo);
  }

  exportGrid() {
    if (this.gridTable) {
      this.gridTable.exportToCsv();
    }
  }

  async updateStatus(pedidos: Pedido[]) {
    const alert = await this.alertController.create({
      header: 'Actualización de pedidos',
      message: 'Actualizar el status de los pedidos en proceso?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Aceptar',
          role: 'accept',
          handler: () => ({ values: 'ACEPTAR' }),
        },
      ],
    });
    await alert.present();
    const { data } = await alert.onWillDismiss();
    if (data.values) {
      this.doUpdatePedidos(pedidos);
    } else {
      console.log('Cancel.....');
    }
  }

  async doUpdatePedidos(pedidos: Pedido[]) {
    this.facade.actalizarStatusDePedidos(pedidos);
  }
}
