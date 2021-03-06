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
import { BaseComponent } from '@papx/core';
import { Direccion } from '@papx/models';
import { BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CodigoPostalService } from '../codigo-postal.service';

@Component({
  selector: 'papx-direccion-form',
  templateUrl: 'direccion-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DireccionFormComponent extends BaseComponent implements OnInit {
  @Input() direccion: Direccion;
  @Input() title = 'Dirección';
  form: FormGroup;
  colonias$ = new BehaviorSubject([]);

  controls: { [key: string]: AbstractControl };
  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private service: CodigoPostalService
  ) {
    super();
  }

  ngOnInit() {
    this.form = this.buildForm(this.direccion);
    this.controls = {
      codigoPostal: this.form.get('codigoPostal'),
      colonia: this.form.get('colonia'),
      calle: this.form.get('calle'),
      numeroExterior: this.form.get('numeroExterior'),
    };
    this.controls.codigoPostal.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((zip) => this.buscar(zip));
  }

  private buildForm(dir: Partial<Direccion> = { pais: 'MEXICO' }): FormGroup {
    return this.fb.group(
      {
        codigoPostal: [
          dir?.codigoPostal,
          { validators: [Validators.required], updateOn: 'blur' },
        ],
        colonia: [dir?.colonia, [Validators.required]],
        calle: [dir?.calle, [Validators.required]],
        numeroExterior: [dir?.numeroExterior ?? null, [Validators.required]],
        numeroInterior: [dir?.numeroInterior ?? null],
        municipio: [
          { value: dir?.municipio ?? null, disabled: true },
          [Validators.required],
        ],
        estado: [
          { value: dir?.estado ?? null, disabled: true },
          [Validators.required],
        ],
        pais: [
          { value: dir?.pais ?? 'MEXICO', disabled: true },
          [Validators.required],
        ],
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
  get colonia() {
    return this.form.get('colonia');
  }

  get valid() {
    return this.form.valid;
  }
  get invalid() {
    return this.form.invalid;
  }
  get pristine() {
    return this.form.pristine;
  }
}