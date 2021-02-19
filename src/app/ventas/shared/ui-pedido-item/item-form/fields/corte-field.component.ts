import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'papx-corte-field',
  template: `
    <ion-grid [formGroup]="form">
      <ion-row>
        <ion-col>
          <!-- <span>
            <ion-text color="secondary">Corte</ion-text>
          </span> -->
          <ion-item-divider>
            <ion-label>Corte</ion-label>
          </ion-item-divider>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <ion-item>
            <ion-label position="floating">Cortes</ion-label>
            <ion-input type="number" formControlName="cantidad"></ion-input>
          </ion-item>
        </ion-col>
        <ion-col>
          <ion-item>
            <ion-label position="floating">Precio</ion-label>
            <ion-input type="number" formControlName="precio"></ion-input>
          </ion-item>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <!-- <papex-instruccion-corte [parent]="form"></sxcc-instruccion-corte> -->
          <papx-instruccion-field [parent]="form"></papx-instruccion-field>
        </ion-col>
      </ion-row>
      <ion-row *ngIf="isEspecial$ | async">
        <ion-col>
          <ion-item>
            <ion-label position="floating"
              >Instucción espeical para el corte</ion-label
            >
            <ion-textarea
              class="ion-text-capitalize"
              formControlName="instruccionEspecial"
              autocapitalize="words"
              color="tertiary"
              enterkeyhint="next"
              rows="2"
            ></ion-textarea>
          </ion-item>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <ion-item>
            <ion-label>Refinado</ion-label>
            <ion-toggle formControlName="refinado"></ion-toggle>
          </ion-item>
        </ion-col>
        <ion-col>
          <ion-item>
            <ion-label>Limpio</ion-label>
            <ion-toggle formControlName="limpio"></ion-toggle>
          </ion-item>
        </ion-col>
      </ion-row>
    </ion-grid>
  `,
})
export class CorteFieldComponent implements OnInit {
  @Input() parent: FormGroup;

  form: FormGroup;
  instruccion: AbstractControl;
  instruccionEspecial: AbstractControl;

  isEspecial$: Observable<boolean>;

  constructor() {}

  ngOnInit() {
    this.buildForm();
    this.instruccion = this.form.get('instruccion');
    this.instruccionEspecial = this.form.get('instruccionEspecial');

    this.isEspecial$ = this.instruccion.valueChanges.pipe(
      map((value) => value === 'ESPECIAL'),
      tap((value) =>
        value
          ? this.instruccionEspecial.enable()
          : this.instruccionEspecial.disable()
      )
    );
  }

  private buildForm() {
    this.form = this.parent.get('corte') as FormGroup;
  }
}
