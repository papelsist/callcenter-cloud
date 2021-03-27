import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'papx-instruccion-field',
  template: `
    <!-- <ion-item [formGroup]="parent">
      <ion-label position="floating">Instrucción de corte</ion-label>
      <ion-select
        placeholder="Tipo de corte"
        formControlName="instruccion"
        interface="popover"
      >
        <ion-select-option *ngFor="let tipo of tipos" [value]="tipo">{{
          tipo
        }}</ion-select-option>
      </ion-select>
    </ion-item> -->
    <!-- <ion-item [formGroup]="parent">
      <ion-label position="floating">Instrucción de corte</ion-label>
      <ion-input
        formControlName="instruccion"
        type="text"
        autocapitalize="words"
      ></ion-input>
    </ion-item> -->

    <mat-form-field class="instruccion" [formGroup]="parent">
      <input
        matInput
        placeholder="Instrucción"
        formControlName="instruccion"
        [matAutocomplete]="auto"
        position="below"
      />
    </mat-form-field>
    <mat-autocomplete #auto="matAutocomplete" autoActiveFirstOption>
      <mat-option
        *ngFor="let option of filteredOptions | async"
        [value]="option"
      >
        {{ option }}
      </mat-option>
    </mat-autocomplete>
  `,
  styles: [
    `
      .instruccion {
        width: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstruccionFieldComponent implements OnInit {
  @Input() parent: FormGroup;
  @Input() property = 'instruccion';

  tipos = [
    'CARTA',
    'OFICIO',
    '***',
    'MITAD',
    'CRUZ',
    'CROQUIS',
    'DOBLE CARTA',
    '1/8',
    '1/9',
    'ESPECIAL',
  ];
  filteredOptions: Observable<string[]>;

  constructor() {}

  ngOnInit() {
    this.filteredOptions = this.parent.get('instruccion').valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.tipos.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
}
