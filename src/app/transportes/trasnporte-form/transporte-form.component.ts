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
    <ion-content class="ion-padding" [formGroup]="form">
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
          <ion-row>
            <papx-direccion-form
              [direccion]="direccion"
              [parent]="form"
            ></papx-direccion-form>
          </ion-row>
        </ion-row>
      </ion-grid>
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
