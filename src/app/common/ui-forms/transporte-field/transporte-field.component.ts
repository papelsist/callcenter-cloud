import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CatalogosService } from '@papx/data-access';

@Component({
  selector: 'papx-transporte-field',
  template: `
    <ion-item
      [formGroup]="parent"
      [disabled]="parent.get('transporte').disabled"
    >
      <ion-icon slot="start" color="dark" name="trail-sign"></ion-icon>
      <ion-label position="floating">{{ label }}</ion-label>
      <ion-select
        placeholder="Transporte"
        interface="action-sheet"
        [interfaceOptions]="customActionSheetOptions"
        [formControlName]="property"
        cancelText="Cancelar"
        [compareWith]="compareWith"
      >
        <ion-select-option [value]="s" *ngFor="let s of transportes$ | async">
          {{ s.nombre }}
        </ion-select-option>
      </ion-select>
    </ion-item>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransporteFieldComponent implements OnInit {
  @Input() parent: FormGroup;
  @Input() property = 'transporte';
  @Input() label = 'Transporte';

  transportes$ = this.service.transportes$;

  customPopoverOptions: any = {
    header: 'Transporte',
    subHeader: 'Seleccione una compañía',
    message: 'Message ??',
  };

  customActionSheetOptions: any = {
    header: 'Compañías de transportes',
  };

  constructor(private service: CatalogosService) {}

  ngOnInit() {}

  compareWith(currentValue: any, compareValue: any) {
    if (!compareValue) {
      return false;
    }
    return currentValue.id === compareValue.id;
  }
}
