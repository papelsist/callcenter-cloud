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

import { ClienteDireccion, Direccion, buildDireccionKey } from '@papx/models';
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
          placeholder="Seleccione otra dirección"
          interface="action-sheet"
          [interfaceOptions]="customActionSheetOptions"
          cancelText="Cancelar"
          [compareWith]="compareWith"
          (ionChange)="onSelection($event)"
        >
          <ion-select-option [value]="s" *ngFor="let s of direcciones">
            <p class="ion-text-wrap">
              {{ s.direccion.calle }} # {{ s.direccion.numeroExterior }}
            </p>
          </ion-select-option>
          <ion-select-option [value]="null"> Otra </ion-select-option>
        </ion-select>
      </ion-item>

      <ion-item-options side="end">
        <ion-item-option color="primary" (click)="addDireccion()">
          Nueva
          <ion-icon slot="bottom" name="add"></ion-icon>
        </ion-item-option>
      </ion-item-options>
    </ion-item-sliding>
    <ion-item *ngIf="!!value">
      <ion-label>
        {{ value.nombre }}
        <address *ngIf="value.direccion as direccion">
          <span
            >Calle: {{ direccion.calle }} Número:
            {{ direccion.numeroExterior }}
            <span *ngIf="direccion.numeroInterior"
              >Int: {{ direccion.numeroInterior }}</span
            >
          </span>
          <div>
            <span>Colonia: {{ direccion.colonia }}</span>
          </div>
          <div>
            <span>Municipio: {{ direccion.municipio }}</span>
            <span class="ion-padding-start"
              >Estado: {{ direccion.estado }}</span
            >
          </div>
          <ion-text color="warning">
            <div>CP: {{ direccion.codigoPostal }}</div>
          </ion-text>
        </address>
      </ion-label>
    </ion-item>
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
      address {
        display: flex;
        flex-direction: column;
        font-size: 0.9rem;
        padding: 10px 0px 5px;
      }
    `,
  ],
})
export class EnvioDireccionComponent
  implements OnInit, ControlValueAccessor, OnChanges
{
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
    if (!currentValue || !compareValue) {
      return false;
    }
    return currentValue.nombre === compareValue.nombre;
  }

  onSelection({ detail: { value } }: any) {
    if (value) {
      this.value = value;
      this.onChange(value);
      this.dc.markForCheck();
    } else {
      this.addDireccion();
    }
  }

  ngOnInit() {}

  async addDireccion() {
    console.log('Nueva direccion de entrega....');
    const direccion: Direccion = await this.direccionController.addDireccion();
    if (direccion) {
      const de: ClienteDireccion = {
        nombre: buildDireccionKey(direccion),
        direccion,
      };
      this.value = de;
      this.onChange(de);
      this.dc.markForCheck();
    }
  }

  show(event: Event) {
    event.preventDefault();
    console.log('Show detail of address');
  }
}
