import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Direccion, Transporte } from '@papx/models';

@Component({
  selector: 'papx-transporte-form',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>
          {{ transporte ? transporte.nombre : 'Alta de transporte' }}
        </ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="close()">
            <ion-label>Cerrar</ion-label>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content [formGroup]="form">
      <ion-grid>
        <ion-row>
          <ion-col>
            <ion-item>
              <ion-label position="floating"> Nombre o Razón social </ion-label>
              <ion-input
                formControlName="nombre"
                placeholder="Digite el nombre del transporte"
              ></ion-input>
            </ion-item>
          </ion-col>
          <ion-col size="3">
            <papx-sucursal-name-control
              class="sucursal"
              formControlName="sucursal"
            ></papx-sucursal-name-control>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <ion-item>
              <ion-label position="floating">Teléfono 1</ion-label>
              <ion-input
                formControlName="telefono1"
                placeholder="Tel 1"
                type="tel"
                clearOnEdit="true"
                inputmode="tel"
              ></ion-input>
            </ion-item>
          </ion-col>
          <ion-col>
            <ion-item>
              <ion-label position="floating">Teléfono 2</ion-label>
              <ion-input
                formControlName="telefono2"
                placeholder="Tel 2"
                type="tel"
                clearOnEdit="true"
                inputmode="tel"
              ></ion-input>
            </ion-item>
          </ion-col>
          <ion-col>
            <ion-item>
              <ion-label position="floating">Teléfono 3</ion-label>
              <ion-input
                formControlName="telefono3"
                placeholder="Tel 3"
                type="tel"
                clearOnEdit="true"
                inputmode="tel"
              ></ion-input>
            </ion-item>
          </ion-col>
        </ion-row>
      </ion-grid>
      <papx-direccion-form
        [direccion]="direccion"
        [parent]="form"
      ></papx-direccion-form>
    </ion-content>
    <ion-footer>
      <ion-toolbar>
        <ion-buttons slot="end">
          <ion-button
            (click)="submit()"
            [disabled]="form.invalid || form.pristine"
          >
            <ion-icon name="save" slot="start"></ion-icon>
            <ion-label>Salvar</ion-label>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-footer>
  `,
  styles: [
    `
      .sucursal {
        height: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransporteFormComponent implements OnInit {
  @Input() transporte: Transporte;
  form: FormGroup;
  direccion: Direccion = null;
  constructor(private controller: ModalController, private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      nombre: [
        null,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(2500),
        ],
      ],
      telefono1: [null],
      telefono2: [null],
      telefono3: [null],
      sucursal: [null],
    });
    if (this.transporte) {
      this.form.patchValue(this.transporte);
      this.direccion = this.transporte.direccion;
    }
  }

  async close() {
    this.controller.dismiss();
  }

  submit() {
    if (this.form.valid) {
      const data = this.form.getRawValue();
      this.controller.dismiss(data);
    }
  }
}
