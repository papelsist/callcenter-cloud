import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { IonInput, ModalController } from '@ionic/angular';
import { InstruccionDeEnvio } from '@papx/models';

@Component({
  selector: 'papx-pedido-maniobra',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title> Cargo por maniobra </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-grid *ngIf="tipo && tipo === 'ENVIO_CARGO'; else noEnvio">
        <ion-row>
          <ion-col>
            <ion-item>
              <ion-label position="floating"> Importe </ion-label>
              <ion-input
                #input
                [formControl]="control"
                placeholder="Importe"
                type="number"
                tabindex="-1"
              ></ion-input>
            </ion-item>
            <ion-text color="warning">
              <p *ngIf="control.getError('required')">Digite el importe</p>
              <p *ngIf="control.getError('min')">Mínimo $10.00</p>
            </ion-text>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <ion-button
              expand="block"
              fill="clear"
              (click)="close()"
              color="default"
              tabindex="14"
            >
              <ion-label>Cancelar</ion-label>
            </ion-button>
          </ion-col>
          <ion-col>
            <ion-button
              color="primary"
              expand="block"
              fill="clear"
              (click)="submit()"
              [disabled]="control.invalid"
              tabindex="10"
            >
              <ion-label>Acpetar</ion-label>
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
      <ng-template #noEnvio>
        <ion-text color="warning">
          <p class="ion-padding">
            Para el cargo por maniobra se requiere Envio con cargo
          </p>
        </ion-text>
      </ng-template>
    </ion-content>
  `,
})
export class ManiobraModalComponent {
  @Input() value = 0;
  @Input() tipo: any = null;
  control = new FormControl(this.value, [
    Validators.required,
    Validators.min(10),
  ]);
  @ViewChild('input') input: IonInput;
  constructor(private modalController: ModalController) {}

  async close() {
    await this.modalController.dismiss();
  }

  submit() {
    if (this.control.valid) {
      this.modalController.dismiss({ importe: +this.control.value });
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.input) this.input.setFocus();
    }, 600);
  }
}
