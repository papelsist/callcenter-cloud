import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { BancosService } from '@papx/data-access';
import { CuentaDeBanco } from '@papx/models';

@Component({
  selector: 'papelx-cuenta-field',
  template: `
    <ion-item>
      <ion-label position="floating">Cuenta destino</ion-label>
      <ion-select
        [compareWith]="compareWith"
        interface="popover"
        [interfaceOptions]="customPopoverOptions"
        (ionChange)="onSelect($event)"
        [value]="value"
      >
        <ion-select-option *ngFor="let cuenta of cuentas" [value]="cuenta">
          {{ cuenta.descripcion }} ({{ cuenta.numero }})
        </ion-select-option>
      </ion-select>
      <ion-icon slot="start" name="folder"></ion-icon>
    </ion-item>
  `,
  styles: [
    `
      /* Set the width to the full container and center the content */
      ion-select {
        width: 100%;
        justify-content: center;
        max-width: 100%;
      }

      /* Set the flex in order to size the text width to its content
      ion-select::part(placeholder),
      ion-select::part(text) {
        flex: 0 0 auto;
      }*/

      /* Set the placeholder color and opacity
      ion-select::part(placeholder) {
        color: #20a08a;
        opacity: 1;
      }
      */
      /* Works - pass "my-custom-class" in cssClass to increase specificity */
      .my-custom-class {
        --width: 100%;
        --height: 70px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CuentaFieldComponent,
      multi: true,
    },
  ],
})
export class CuentaFieldComponent implements OnInit, ControlValueAccessor {
  onChange: any;
  onTouch: any;
  disabled = false;
  value: CuentaDeBanco;
  @Output() cambio = new EventEmitter<CuentaDeBanco>();

  @Input() cuentas: CuentaDeBanco[] = [];

  customPopoverOptions: any = {
    header: 'Catálogo de cuentas',
    cssClass: 'cuenta-de-banco-field-popup ',
  };

  constructor(private cd: ChangeDetectorRef, private service: BancosService) {}

  ngOnInit() {
    this.loadBancos();
  }

  private loadBancos() {
    this.service.cuentas$.subscribe((data) => {
      this.cuentas = data;
      this.cd.markForCheck();
    });
  }

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

  onSelect({ detail: { value } }: any) {
    this.value = value;
    this.onChange(value);
    this.cambio.emit(value);
    this.cd.markForCheck();
  }

  compareWith(item1: CuentaDeBanco, item2: CuentaDeBanco) {
    return item1 && item2 ? item1.id === item2.id : item1 === item2;
  }
}
