import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'papx-date-field',
  template: `
    <ion-item [disabled]="disabled">
      <ion-icon name="calendar" slot="start" color="dark"></ion-icon>
      <ion-label position="floating">{{ label }}</ion-label>
      <ion-datetime
        [cancelText]="cancelText"
        [doneText]="doneText"
        [displayFormat]="displayFormat"
        [dayShortNames]="dayShortNames"
        [monthShortNames]="monthShortNames"
        (ionChange)="setDate($event)"
        [value]="value"
      ></ion-datetime>
    </ion-item>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: DateFieldComponent,
      multi: true,
    },
  ],
})
export class DateFieldComponent implements ControlValueAccessor {
  @Input() displayFormat = 'DD, MMM YYYY';
  @Input() cancelText = 'Cancelar';
  @Input() doneText = 'Seleccionar';
  @Input() label = 'Fecha';

  dayShortNames = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'];
  onChange: any;
  onTouch: any;
  disabled = false;
  value: string;

  monthShortNames = [
    'ene',
    'feb',
    'mar',
    'abr',
    'may',
    'jun',
    'jul',
    'ago',
    'sep',
    'oct',
    'nov',
    'dic',
  ];
  constructor(private cd: ChangeDetectorRef) {}

  writeValue(obj: any): void {
    if (obj) {
      this.value = obj;
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

  setDate({ detail: { value } }) {
    this.onChange(value);
  }
}
