import {
  Component,
  ChangeDetectorRef,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { ClienteDto } from '@papx/models';
import { ClienteSelectorComponent } from '../cliente-selector.component';

@Component({
  selector: 'papelx-cliente-selector-field',
  templateUrl: './cliente-selector-field.component.html',
  styleUrls: ['./cliente-selector-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ClienteSelectorFieldComponent,
      multi: true,
    },
  ],
})
export class ClienteSelectorFieldComponent implements ControlValueAccessor {
  onChange = (data: any) => {};
  onTouch = () => {};
  disabled = false;
  value: ClienteDto;

  constructor(
    private cd: ChangeDetectorRef,
    private modalController: ModalController
  ) {}

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

  async lookupCliente() {
    const modal = await this.modalController.create({
      component: ClienteSelectorComponent,
      cssClass: 'cteSelector',
      componentProps: {},
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.value = data;
      this.onChange(data);
      this.cd.markForCheck();
    }
    // Once the cliente is obtain call this.onChange .
  }

  getClienteNombre() {
    return this.value ?? 'Seleccione un cliente';
  }
}
