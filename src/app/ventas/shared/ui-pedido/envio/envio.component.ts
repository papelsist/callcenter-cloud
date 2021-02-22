import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

import { takeUntil, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import capitalize from 'lodash-es/capitalize';
import words from 'lodash-es/words';

// import { differenceInHours } from 'date-fns/fp';
import differenceInHours from 'date-fns/differenceInHours';

import { BaseComponent } from '@papx/core';
import { ClienteDireccion } from '@papx/models';

const hourToDate = (value: string): Date => {
  const [hours, minutes] = value.split(':').map((item) => parseFloat(item));
  const now = new Date();
  now.setHours(hours);
  now.setMinutes(minutes);
  now.setSeconds(0);
  now.setMinutes(0);
  return now;
};

const HorarioValidator = (
  control: AbstractControl
): ValidationErrors | null => {
  const horario = control.value;
  const horaInicial = hourToDate(horario.horaInicial);
  const horaFinal = hourToDate(horario.horaFinal);
  const diff = differenceInHours(horaInicial, horaFinal);
  return diff < 1 ? { tooEarly: true } : null;
};

@Component({
  selector: 'papx-envio-form',
  template: `
    <ion-grid>
      <ion-row class="ion-align-items-stretch">
        <ion-col size="12" size-sm="4" push-sm="8">
          <ion-item>
            <ion-label position="stacked"> Habilitar</ion-label>
            <ion-toggle (ionChange)="setEnvio($event)"></ion-toggle>
          </ion-item>
        </ion-col>
        <ion-col size="12" size-sm="8" pull-sm="4">
          <sxcc-envio-tipo [parent]="form" class="tipo"></sxcc-envio-tipo>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <papx-transporte-field [parent]="form"></papx-transporte-field>
        </ion-col>
      </ion-row>

      <ion-row>
        <ion-col [formGroup]="form">
          <sxcc-envio-direccion
            formControlName="direccion"
            [direcciones]="direcciones$ | async"
          ></sxcc-envio-direccion>
        </ion-col>
      </ion-row>
      <ion-row [formGroup]="form">
        <ion-col size="12" size-md="6">
          <ion-item [disabled]="form.get('contacto').disabled">
            <ion-icon name="person-circle" slot="start" color="dark"></ion-icon>

            <ion-label position="floating">Contacto *</ion-label>
            <ion-input
              formControlName="contacto"
              class="ion-text-capitalize"
              autocapitalize="on"
            ></ion-input>
          </ion-item>
          <ion-note
            color="danger"
            *ngIf="controls.contacto.hasError('required') && form.dirty"
          >
            Se requiere el nombre del contacto
          </ion-note>
          <ion-note
            class="ion-padding-start ion-padding-top"
            *ngIf="controls.contacto.hasError('minlength')"
          >
            Mínimo 5 caracteres
          </ion-note>
          <ion-note
            class="ion-padding-start ion-padding-top"
            *ngIf="controls.contacto.hasError('maxlength')"
          >
            Máximo 50 caracteres
          </ion-note>
        </ion-col>
        <ion-col size="12" size-md="6">
          <ion-item [disabled]="controls.telefono.disabled">
            <ion-icon name="call" color="dark" slot="start"></ion-icon>
            <ion-label position="floating">Teléfono</ion-label>
            <ion-input
              type="tel"
              formControlName="telefono"
              inputmode="tel"
            ></ion-input>
            <ion-icon
              name="checkmark"
              color="success"
              slot="end"
              *ngIf="controls.telefono.valid && form.dirty"
            ></ion-icon>
          </ion-item>
          <ion-note
            class="ion-padding-start"
            color="danger"
            *ngIf="
              (controls.telefono.hasError('minlength') ||
                controls.telefono.hasError('maxlength') ||
                controls.telefono.hasError('required')) &&
              form.dirty
            "
          >
            Se requiere número a 10 digitos
          </ion-note>
        </ion-col>
      </ion-row>

      <ion-row [formGroup]="form">
        <ion-col size="12" size-md="6">
          <papx-date-field
            formControlName="fechaDeEntrega"
            label="Entrega"
          ></papx-date-field>
        </ion-col>
        <ion-col>
          <sxcc-envio-horario-field
            formControlName="horario"
          ></sxcc-envio-horario-field>
          <ion-note
            color="danger"
            class="ion-padding-start ion-padding-top"
            *ngIf="controls.horario.hasError('tooEarly')"
          >
            Debe haber al menos 1 hora de intervalo
          </ion-note>
        </ion-col>
      </ion-row>

      <ion-row [formGroup]="form">
        <ion-col>
          <ion-item>
            <ion-label position="floating">Comentario </ion-label>
            <ion-textarea
              formControlName="comentario"
              class="ion-text-capitalize"
            ></ion-textarea>
          </ion-item>
        </ion-col>
      </ion-row>
    </ion-grid>
  `,
  styles: [
    `
      .tipo-panel {
        display: flex;
        .tipo {
          flex: 1;
        }
      }
      .tipo {
        width: 100%;
        flex: 1;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnvioComponent extends BaseComponent implements OnInit {
  @Input() parent: FormGroup;
  form: FormGroup;

  controls: { [key: string]: AbstractControl };

  direcciones$: Observable<ClienteDireccion[]>;

  constructor() {
    super();
  }

  ngOnInit() {
    this.initForm();
    this.setControls();
    this.setupHorarioControl();
    this.registerContactoListener();
    this.registerTipoListener();
  }

  private initForm() {
    this.form = this.parent.get('envio') as FormGroup;
    this.form.status === 'INVALID' ? this.form.disable() : this.form.enable();
  }

  private setControls() {
    this.controls = {
      tipo: this.form.controls.tipo,
      transporte: this.form.controls.transporte,
      contacto: this.form.controls.contacto,
      telefono: this.form.controls.telefono,
      horario: this.form.controls.horario,
      fechaDeEntrega: this.form.controls.fechaDeEntrega,
    };
  }

  private setupHorarioControl() {
    const horario: AbstractControl = this.form.get('horario');
    horario.setValidators(HorarioValidator);
    horario.updateValueAndValidity();
  }

  private registerContactoListener() {
    this.contacto.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        const res = words(val)
          .map((item) => capitalize(item))
          .join(' ');
        this.form.patchValue(
          { contacto: res },
          { emitEvent: false, onlySelf: true }
        );
      });
  }

  private registerTipoListener() {
    this.tipo.valueChanges
      .pipe(
        map((t) => t === 'FORANEO' || t === 'OCURRE'),
        takeUntil(this.destroy$)
      )
      .subscribe((valid) =>
        valid ? this.transporte.enable() : this.transporte.disable()
      );
  }

  setEnvio({ detail: { checked } }: any) {
    checked ? this.form.enable() : this.form.disable();
  }

  get tipo(): AbstractControl {
    return this.controls.tipo;
  }
  get transporte(): AbstractControl {
    return this.controls.transporte;
  }
  get contacto(): AbstractControl {
    return this.controls.contacto;
  }
}
