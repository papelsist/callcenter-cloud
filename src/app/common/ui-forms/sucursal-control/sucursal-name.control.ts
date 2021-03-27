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
  selector: 'papx-sucursal-name-control',
  template: `
    <ion-item>
      <ion-label position="floating" *ngIf="floating">Sucursal</ion-label>
      <ion-select
        placeholder="Sucursal"
        interface="popover"
        [interfaceOptions]="customPopoverOptions"
        (ionChange)="onSelection($event)"
        [value]="value"
        [disabled]="disabled"
      >
        <ion-select-option
          *ngFor="let sucursal of sucursales"
          [value]="sucursal"
        >
          {{ sucursal }}
        </ion-select-option>
      </ion-select>

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
      useExisting: SucursalNameControlComponent,
      multi: true,
    },
  ],
})
export class SucursalNameControlComponent
  implements OnInit, ControlValueAccessor {
  onChange: any = () => {};
  onTouch: any;
  disabled = false;
  value: Partial<Sucursal>;

  @Input() sucursales = [
    'ANDRADE',
    'BOLIVAR',
    'CALLE 4',
    'CF5FEBRERO',
    'TACUBA',
  ];
  @Input() floating = true;

  customPopoverOptions: any = {
    cssClass: 'sucursal-popup',
  };

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {}

  writeValue(obj: any): void {
    this.value = obj;
    this.cd.markForCheck();
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
