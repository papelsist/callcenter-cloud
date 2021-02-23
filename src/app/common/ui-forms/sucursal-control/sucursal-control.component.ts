import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Sucursal } from '@papx/models';
import { SUCURSALES } from './sucursales';

@Component({
  selector: 'papx-sucursal-control',
  template: `
    <ion-item>
      <!-- <ion-label position="floating">Sucursal</ion-label> -->
      <ion-select
        placeholder="Sucursal"
        [compareWith]="compareWith"
        interface="popover"
        [interfaceOptions]="customPopoverOptions"
        (ionChange)="onSelection($event)"
        [value]="value"
      >
        <ion-select-option
          *ngFor="let sucursal of sucursales"
          [value]="sucursal"
        >
          {{ sucursal.nombre }}
        </ion-select-option>
      </ion-select>
      <!-- <ion-icon size="small" slot="start" name="business"></ion-icon> -->
      <ion-icon slot="start" name="storefront"></ion-icon>
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
      useExisting: SucursalControlComponent,
      multi: true,
    },
  ],
})
export class SucursalControlComponent implements OnInit, ControlValueAccessor {
  onChange: any = () => {};
  onTouch: any;
  disabled = false;
  value: Partial<Sucursal>;

  @Input() sucursales: Partial<Sucursal[]> = SUCURSALES;

  customPopoverOptions: any = {
    header: 'Catálogo de sucursales',
    cssClass: 'sucursal-popup',
  };

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

  compareWith(item1: Sucursal, item2: Sucursal) {
    return item1 && item2 ? item1.id === item2.id : item1 === item2;
  }

  onSelection({ detail: { value } }: any) {
    this.value = value;
    this.onChange(value);
    this.cd.markForCheck();
  }
}
