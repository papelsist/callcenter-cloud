import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { ClienteDireccion } from '@papx/models';
import { DireccionController } from '@papx/shared/direccion';

@Component({
  selector: 'sxcc-envio-direccion',
  template: `
    <ion-item-sliding [disabled]="disabled">
      <ion-item color="light" [disabled]="disabled" button>
        <ion-icon
          name="location"
          color="dark"
          slot="start"
          (click)="show($event)"
        ></ion-icon>

        <ion-label position="floating"> Dirección de engrega </ion-label>
        <ion-select
          placeholder="Seleccione la dirección "
          interface="action-sheet"
          [interfaceOptions]="customActionSheetOptions"
          cancelText="Cancelar"
          [compareWith]="compareWith"
          (ionChange)="onSelection($event)"
        >
          <ion-select-option [value]="s" *ngFor="let s of direcciones">
            <p class="ion-text-wrap">
              {{ s.direccion.calle }} # {{ s.direccion.numeroExterior }}
              {{ s.direccion.colonia }},
            </p>
          </ion-select-option>
        </ion-select>
        <div *ngIf="value as s" class="ion-padding-bottom ion-text-wrap">
          {{ s.direccion.municipio }} , {{ s.direccion.estado }}, C.P:{{
            s.direccion.codigoPostal
          }}
        </div>
      </ion-item>

      <ion-item-options side="end">
        <ion-item-option color="primary" (click)="addDireccion()">
          Nueva
          <ion-icon slot="bottom" name="add"></ion-icon>
        </ion-item-option>
        <ion-item-option color="danger">
          Eliminar
          <ion-icon slot="bottom" name="trash"></ion-icon>
        </ion-item-option>
        <ion-item-option color="tertiary">
          Modificar
          <ion-icon slot="bottom" name="create"></ion-icon>
        </ion-item-option>
      </ion-item-options>
    </ion-item-sliding>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: EnvioDireccionComponent,
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .text {
        color: red;
      }
    `,
  ],
})
export class EnvioDireccionComponent
  implements OnInit, ControlValueAccessor, OnChanges {
  disabled = false;
  value: any;
  onChange: any;
  onTouch: any;
  @Input() direcciones: ClienteDireccion[];

  customActionSheetOptions: any = {
    header: 'Direcciones registradas',
  };

  constructor(
    private direccionController: DireccionController,
    private dc: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const { firstChange, currentValue } = changes.direcciones;
    if (!firstChange) {
      // console.log('Direcciones: ', currentValue);
    }
  }
  writeValue(obj: any): void {
    this.value = obj;
    this.dc.markForCheck();
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.dc.markForCheck();
  }

  compareWith(currentValue: any, compareValue: any) {
    if (!compareValue) {
      return false;
    }
    return currentValue.id === compareValue.id;
  }

  onSelection({ detail: { value } }: any) {
    this.value = value;
    this.onChange(value);
    this.dc.markForCheck();
  }

  ngOnInit() {}

  async addDireccion() {
    const direccion = await this.direccionController.addDireccion();
    if (direccion) {
      this.value = direccion;
      this.onChange(direccion);
      this.dc.markForCheck();
    }
  }

  show(event: Event) {
    event.preventDefault();
    console.log('Show detail of address');
  }
}
