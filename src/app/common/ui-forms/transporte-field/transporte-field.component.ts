import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { FormGroup } from '@angular/forms';
import { CatalogosService } from '@papx/data-access';

import { Transporte } from '@papx/models';
import { take } from 'rxjs/operators';

@Component({
  selector: 'papx-transporte-field',
  template: `
    <ion-item [formGroup]="parent" [disabled]="disabled">
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
          {{ s.nombre }} <sub>({{ s.sucursal }})</sub>
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
  @Input() disabled = false;

  transportes$ = this.catalogos.transportes$;

  customPopoverOptions: any = {
    header: 'Transporte',
    subHeader: 'Seleccione una compañía',
    message: 'Message ??',
  };

  customActionSheetOptions: any = {
    header: 'Compañías de transportes',
  };

  constructor(private catalogos: CatalogosService) {}

  ngOnInit() {}

  compareWith(currentValue: any, compareValue: any) {
    if (!compareValue) {
      return false;
    }
    return currentValue.id === compareValue.id;
  }
}
