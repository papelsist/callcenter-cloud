import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormaDePago } from '@papx/models';

@Component({
  selector: 'papx-forma-pago-control',
  template: `
    <ion-item>
      <!-- <ion-label position="floating">Sucursal</ion-label> -->
      <ion-select
        placeholder="Forma de pago"
        interface="popover"
        (ionChange)="onSelection($event)"
        [value]="value"
      >
        <ion-select-option *ngFor="let tipo of tipos" [value]="tipo.clave">
          {{ tipo.descripcion }}
        </ion-select-option>
      </ion-select>
      <ion-icon name="cash" slot="start"></ion-icon>
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
      useExisting: FormaDePagoControlComponent,
      multi: true,
    },
  ],
})
export class FormaDePagoControlComponent
  implements OnInit, ControlValueAccessor {
  onChange: any;
  onTouch: any;
  disabled = false;
  value: FormaDePago;

  @Input() tipos = [
    { clave: FormaDePago.EFECTIVO, descripcion: 'Efectivo' },
    { clave: FormaDePago.TRANSFERENCIA, descripcion: 'Transferencia' },
    { clave: FormaDePago.DEPOSITO_EFECTIVO, descripcion: 'Dep efectivo' },
    { clave: FormaDePago.DEPOSITO_CHEQUE, descripcion: 'Dep cheque' },
    { clave: FormaDePago.DEPOSITO_MIXTO, descripcion: 'Dep mixto' },
    { clave: FormaDePago.TARJETA_CRE, descripcion: 'Tarjeta (Cre)' },
    { clave: FormaDePago.TARJETA_DEB, descripcion: 'Tarjeta (Deb)' },
    { clave: FormaDePago.CHEQUE, descripcion: 'Cheque' },
    { clave: FormaDePago.CHEQUE_PSTF, descripcion: 'Cheque (PSF)' },
    { clave: FormaDePago.NO_DEFINIDO, descripcion: 'No definido' },
  ];

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

  // compareWith(item1: FormaDePago, item2: FormaDePago) {
  //   return item1 && item2 ? item1.clave === item2.id : item1 === item2;
  // }

  onSelection({ detail: { value } }: any) {
    // const detail = {e}
    this.value = value;
    this.onChange(value);
    this.cd.markForCheck();
  }
}
