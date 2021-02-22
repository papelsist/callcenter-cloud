import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Direccion } from '@papx/models';
import { BehaviorSubject } from 'rxjs';
import { CodigoPostalService } from './codigo-postal.service';

@Component({
  selector: 'sxcc-direccion-edit',
  template: `
    <ion-header translucent>
      <ion-toolbar>
        <ion-title>{{ title }}</ion-title>
        <ion-buttons slot="end">
          <ion-button
            color="primary"
            (click)="dismissModal()"
            [disabled]="form.pristine || form.invalid"
            >{{ direccion ? 'Aceptar' : 'Agregar' }}</ion-button
          >
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content fullscreen>
      <ion-grid [formGroup]="form">
        <ion-row>
          <ion-col>
            <ion-item>
              <ion-label position="floating">Código postal</ion-label>
              <ion-input
                placeholder="Digite el código postal"
                formControlName="codigoPostal"
                #zip
                (keyup.enter)="buscar(zip.value)"
              ></ion-input>
              <ion-icon name="location" slot="start"></ion-icon>
            </ion-item>
            <ion-note
              color="danger"
              *ngIf="controls.codigoPostal.hasError('required')"
            >
              Se requiere el código postal
            </ion-note>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <ion-item>
              <ion-label position="floating">Colonia</ion-label>
              <ion-select
                placeholder="Colonia"
                interface="action-sheet"
                formControlName="colonia"
                cancelText="Cancelar"
              >
                <ion-select-option
                  [value]="s"
                  *ngFor="let s of colonias$ | async"
                >
                  {{ s }}
                </ion-select-option>
              </ion-select>
            </ion-item>
            <ion-note
              color="danger"
              *ngIf="controls.colonia.hasError('required')"
            >
              Se requiere la colonia
            </ion-note>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <ion-item>
              <ion-label position="floating">Calle</ion-label>
              <ion-input formControlName="calle"></ion-input>
            </ion-item>
            <ion-note
              color="danger"
              *ngIf="controls.calle.hasError('required')"
            >
              Se requiere la calle
            </ion-note>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col size="6">
            <ion-item>
              <ion-label position="floating">Número exterior</ion-label>
              <ion-input formControlName="numeroExterior"></ion-input>
            </ion-item>
            <ion-note
              color="danger"
              *ngIf="controls.numeroExterior.hasError('required')"
            >
              Se el número exterior
            </ion-note>
          </ion-col>
          <ion-col size="6">
            <ion-item>
              <ion-label position="floating">Número interior</ion-label>
              <ion-input formControlName="numeroInterior"></ion-input>
            </ion-item>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col size="6">
            <ion-item>
              <ion-label position="floating">Municipio</ion-label>
              <ion-input formControlName="municipio"></ion-input>
            </ion-item>
          </ion-col>
          <ion-col size="6">
            <ion-item>
              <ion-label position="floating">Estado</ion-label>
              <ion-input formControlName="estado"></ion-input>
            </ion-item>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col size="6">
            <ion-item>
              <ion-label position="floating">País</ion-label>
              <ion-input formControlName="pais"></ion-input>
            </ion-item>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DireccionEditComponent implements OnInit {
  @Input() direccion: Direccion;
  @Input() title = 'Dirección';
  form: FormGroup;
  colonias$ = new BehaviorSubject([]);

  controls: { [key: string]: AbstractControl };
  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private service: CodigoPostalService
  ) {}

  ngOnInit() {
    this.form = this.buildForm();
    if (this.direccion) this.form.setValue(this.direccion);

    this.controls = {
      codigoPostal: this.form.get('codigoPostal'),
      colonia: this.form.get('colonia'),
      calle: this.form.get('calle'),
      numeroExterior: this.form.get('numeroExterior'),
    };
  }

  private buildForm(): FormGroup {
    return this.fb.group(
      {
        codigoPostal: [
          null,
          { validators: [Validators.required], updateOn: 'blur' },
        ],
        colonia: [null, [Validators.required]],
        calle: [null, [Validators.required]],
        numeroExterior: [null, [Validators.required]],
        numeroInterior: [null],
        municipio: [{ value: null, disabled: true }, [Validators.required]],
        estado: [{ value: null, disabled: true }, [Validators.required]],
        pais: [{ value: 'MEXICO', disabled: true }, [Validators.required]],
      },
      { updateOn: 'blur' }
    );
  }

  buscar(zip: any) {
    this.service.fetchData(zip).subscribe(
      (res) => {
        const data = res.map((item) => item.response);
        if (data && data.length > 0) {
          const { estado, municipio } = data[0];
          this.form.patchValue({ estado, municipio });
          this.colonias$.next(data.map((x) => x.asentamiento));
        }
      },
      (err) => console.log('Error obteniendo Zip Data', err)
    );
  }

  dismissModal() {
    if (this.form.valid) this.modalCtrl.dismiss(this.form.getRawValue());
  }
}
