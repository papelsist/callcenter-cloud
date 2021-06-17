import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { FormGroup } from '@angular/forms';

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
          {{ s.nombre }}
        </ion-select-option>
      </ion-select>
    </ion-item>
  `,
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransporteFieldComponent implements OnInit {
  @Input() parent: FormGroup;
  @Input() property = 'transporte';
  @Input() label = 'Transporte';
  @Input() disabled = true;

  transportes$ = this.afs
    .collection<Transporte>('transportes', (ref) => ref.orderBy('nombre'))
    .valueChanges({ idField: 'id' })
    .pipe(take(1));

  customPopoverOptions: any = {
    header: 'Transporte',
    subHeader: 'Seleccione una compañía',
    message: 'Message ??',
  };

  customActionSheetOptions: any = {
    header: 'Compañías de transportes',
  };

  constructor(private afs: AngularFirestore) {}

  ngOnInit() {
    this.parent
      .get('tipo')
      .valueChanges.pipe(take(1))
      .subscribe((value) => {
        if (value === 'FORANEO' || value === 'OCURRE') {
          this.disabled = false;
        } else {
          this.disabled = true;
        }
      });
  }

  compareWith(currentValue: any, compareValue: any) {
    if (!compareValue) {
      return false;
    }
    return currentValue.id === compareValue.id;
  }
}
