import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'papx-corte-field',
  template: `
    <ion-grid [formGroup]="form" class="ion-no-margin">
      <ion-row>
        <ion-col size="6" size-md="2">
          <ion-item class="cantidad">
            <ion-label position="floating">Cortes</ion-label>
            <ion-input type="number" formControlName="cantidad"></ion-input>
          </ion-item>
        </ion-col>
        <ion-col size="6" size-md="2">
          <ion-item>
            <ion-label position="floating">Precio</ion-label>
            <ion-input type="number" formControlName="precio"></ion-input>
          </ion-item>
        </ion-col>
        <ion-col size="12" size-md="6">
          <papx-instruccion-field [parent]="form"></papx-instruccion-field>
        </ion-col>

        <ion-col size="12" size-md="2">
          <div class="refinado">
            <div class="ref">
              <span>Refinado</span>
              <ion-checkbox formControlName="refinado"></ion-checkbox>
            </div>
            <div>
              <span>Limpio</span>
              <ion-checkbox formControlName="limpio"></ion-checkbox>
            </div>
          </div>
        </ion-col>
      </ion-row>

      <ion-row *ngIf="isEspecial$ | async">
        <ion-col>
          <ion-item>
            <ion-label position="floating"
              >Instucción espeical para el corte</ion-label
            >
            <ion-textarea
              class="ion-text-uppercase"
              formControlName="instruccionEspecial"
              autocapitalize="words"
              color="tertiary"
              enterkeyhint="next"
              rows="2"
            ></ion-textarea>
          </ion-item>
        </ion-col>
      </ion-row>
    </ion-grid>
  `,
  styles: [
    `
      ion-item-divider {
        --padding-top: 0px;
        --padding-bottom: 0px;
        --inner-padding-top: 0px;
        height: 20px;
      }
      ion-item {
        font-size: 1rem;
      }
      .cantidad {
      }
      .refinado {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .refinado div {
        flex: 1;
        display: flex;
        justify-content: space-between;
        font-size: 0.9rem;
      }
    `,
  ],
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
