import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'sxcc-envio-horario-field',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: EnvioHorarioFieldComponent,
      multi: true,
    },
  ],
  template: `
    <ion-grid class="ion-no-padding">
      <ion-row>
        <ion-col size="6">
          <ion-item>
            <ion-label position="floating">Entregar de:</ion-label>
            <ion-datetime
              mode="ios"
              [displayFormat]="displayFormat"
              [pickerFormat]="pickerFormat"
              [doneText]="doneText"
              [cancelText]="cancelText"
              [minuteValues]="minuteValues"
              (ionChange)="setHoraInicial($event)"
              [value]="value.horaInicial"
              [disabled]="disabled"
            ></ion-datetime>
          </ion-item>
        </ion-col>
        <ion-col size="6" class="ion-padding-start">
          <ion-item>
            <ion-label position="floating">Hasta las:</ion-label>
            <ion-datetime
              mode="ios"
              [displayFormat]="displayFormat"
              [pickerFormat]="pickerFormat"
              [doneText]="doneText"
              [cancelText]="cancelText"
              [minuteValues]="minuteValues"
              (ionChange)="setHoraFinal($event)"
              [value]="value.horaFinal"
              [disabled]="disabled"
            ></ion-datetime>
          </ion-item>
        </ion-col>
      </ion-row>
    </ion-grid>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnvioHorarioFieldComponent implements ControlValueAccessor {
  @Input() doneText = 'Aceptar';
  @Input() cancelText = 'Cancelar';
  @Input() displayFormat = 'hh:mm A';
  @Input() pickerFormat = 'HH:mm';
  @Input() minuteValues = '0,15,30,45';
  value: {
    horaInicial: string;
    horaFinal: string;
  } = {
    horaInicial: '09:00',
    horaFinal: '19:00',
  };

  private onChange: any;
  private onTouch: any;
  disabled = false;

  constructor(private cd: ChangeDetectorRef) {}

  writeValue(obj: any): void {
    if (obj) {
      this.value = { ...obj };
    }
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cd.markForCheck();
  }

  setHoraInicial({ detail: { value } }: any) {
    const horario = { horaInicial: value, horaFinal: this.value.horaFinal };
    this.onChange(horario);
  }

  setHoraFinal({ detail: { value } }: any) {
    const horario = { horaFinal: value, horaInicial: this.value.horaInicial };
    this.onChange(horario);
  }
}
