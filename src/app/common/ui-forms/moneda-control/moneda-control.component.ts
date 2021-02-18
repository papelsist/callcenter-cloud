import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'papx-moneda-control',
  template: `
    <ion-item>
      <!-- <ion-label position="floating">Sucursal</ion-label> -->
      <ion-select
        placeholder="Moneda"
        interface="popover"
        (ionChange)="onSelection($event)"
        [value]="value"
      >
        <ion-select-option
          *ngFor="let moneda of ['MXN', 'USD']"
          [value]="moneda"
        >
          {{ moneda }}
        </ion-select-option>
      </ion-select>
      <ion-icon slot="start" name="receipt"></ion-icon>
    </ion-item>
  `,
  styles: [
    `
      ion-select {
        width: 100%;
        justify-content: center;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: MonedaControlComponent,
      multi: true,
    },
  ],
})
export class MonedaControlComponent implements OnInit, ControlValueAccessor {
  onChange: any;
  onTouch: any;
  disabled = false;
  value: string;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {}

  writeValue(obj: any): void {
    this.value = obj;
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

  onSelection({ detail: { value } }: any) {
    this.value = value;
    this.onChange(value);
    this.cd.markForCheck();
  }
}
