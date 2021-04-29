import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'papx-email-target',
  template: `
    <ion-grid class="ion-padding container" [formGroup]="form">
      <ion-row>
        <ion-col>
          <ion-list-header>
            <ion-label>{{ header }}</ion-label>
          </ion-list-header>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <ion-item>
            <ion-label position="floating">{{ message }}</ion-label>
            <ion-input
              type="email"
              [placeholder]="placeholder"
              formControlName="target"
              required="true"
            ></ion-input>
          </ion-item>
          <ion-text
            color="warning"
            *ngIf="
              form.get('target').hasError('email') ||
              form.get('target').hasError('required')
            "
          >
            <p>Correo inválido</p>
          </ion-text>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <ion-item>
            <ion-select
              placeholder="Tipo"
              interface="popover"
              formControlName="tipo"
            >
              <ion-select-option
                *ngFor="let tipo of ['COTIZACION', 'CONFIRMACION']"
                [value]="tipo"
              >
                {{ tipo }}
              </ion-select-option>
            </ion-select>
          </ion-item>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <div class="actions ">
            <ion-button (click)="close()" color="dark" fill="clear">
              Cancelra
            </ion-button>
            <ion-button
              (click)="submit()"
              [disabled]="form.invalid"
              fill="clear"
            >
              Aceptar
            </ion-button>
          </div>
        </ion-col>
      </ion-row>
    </ion-grid>
  `,
  styles: [
    `
      .container {
        width: 100%x;
      }
      .actions {
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }
    `,
  ],
})
export class EmailTargetComponent implements OnInit {
  @Input() header: string = 'Envío de correo';
  @Input() message: string = 'Destino';
  @Input() placeholder = 'Digite el correo destino';
  @Input() value: string = null;

  form: FormGroup;

  constructor(private popoverController: PopoverController) {}

  ngOnInit() {
    this.form = new FormGroup({
      target: new FormControl(this.value, [
        Validators.required,
        Validators.email,
      ]),
      tipo: new FormControl('COTIZACION'),
    });
  }

  close() {
    this.popoverController.dismiss();
  }

  submit() {
    if (this.form.valid) {
      this.popoverController.dismiss(this.form.value);
    }
  }
}
