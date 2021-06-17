import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { BancosService } from '@papx/data-access';
import { Banco } from '@papx/models';

@Component({
  selector: 'papelx-banco-field',
  template: `
    <ion-item>
      <ion-label position="floating">Banco orgien</ion-label>
      <ion-select
        [compareWith]="compareWith"
        interface="popover"
        [interfaceOptions]="customPopoverOptions"
        (ionChange)="onSelection($event)"
        [value]="value"
      >
        <ion-select-option *ngFor="let banco of bancos" [value]="banco">
          {{ banco.nombre }}
        </ion-select-option>
      </ion-select>
      <ion-icon size="small" slot="start" name="business"></ion-icon>
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
      useExisting: BancoFieldComponent,
      multi: true,
    },
  ],
})
export class BancoFieldComponent implements OnInit, ControlValueAccessor {
  onChange: any;
  onTouch: any;
  disabled = false;
  value: Banco;

  @Input() bancos: Banco[] = [];

  customPopoverOptions: any = {
    header: 'Catálogo de bancos',
    cssClass: 'banco-field-popup',
  };

  constructor(private cd: ChangeDetectorRef, private service: BancosService) {}

  ngOnInit() {
    this.loadBancos();
  }

  private loadBancos() {
    this.service.bancos$.subscribe((data) => {
      this.bancos = data;
      this.cd.markForCheck();
    });
  }

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

  compareWith(item1: Banco, item2: Banco) {
    return item1 && item2 ? item1.id === item2.id : item1 === item2;
  }

  onSelection({ detail: { value } }: any) {
    // const detail = {e}
    this.value = value;
    this.onChange(value);
    this.cd.markForCheck();
  }
}
