import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

import { takeUntil, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import capitalize from 'lodash-es/capitalize';
import words from 'lodash-es/words';
import { differenceInHours } from 'date-fns';

import { BaseComponent } from '@papx/core';
import {
  Cliente,
  ClienteDireccion,
  buildDireccionKey,
  Direccion,
} from '@papx/models';
import { CatalogosService } from '@papx/data-access';

const hourToDate = (value: string): Date => {
  const [hours, minutes] = value.split(':').map((item) => parseFloat(item));
  const now = new Date();
  now.setHours(hours);
  now.setMinutes(minutes);
  now.setSeconds(0);
  now.setMinutes(0);
  return now;
};

const HorarioValidator = (
  control: AbstractControl
): ValidationErrors | null => {
  const horario = control.value;
  if (typeof horario == 'string') {
    return null;
  }
  if (horario) {
    const horaInicial = hourToDate(horario.horaInicial);
    const horaFinal = hourToDate(horario.horaFinal);
    const diff = differenceInHours(horaFinal, horaInicial);
    return diff < 1 ? { tooEarly: true } : null;
  }
  return null;
};

const findDirecciones = (cliente: Partial<Cliente>): ClienteDireccion[] => {
  if (cliente.rfc === 'XAXX010101000') return [];
  if (cliente.direcciones) {
    return cliente.direcciones;
  } else {
    return [
      {
        direccion: cliente.direccion,
        nombre: buildDireccionKey(cliente.direccion),
      },
    ];
  }
};

@Component({
  selector: 'papx-envio-form',
  templateUrl: 'envio.component.html',
  styleUrls: ['envio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnvioComponent extends BaseComponent implements OnInit {
  @Input() parent: FormGroup;
  form: FormGroup;

  controls: { [key: string]: AbstractControl };

  direcciones$: Observable<ClienteDireccion[]>;
  direcciones: ClienteDireccion[] = [];

  constructor(private catalogos: CatalogosService) {
    super();
  }

  ngOnInit() {
    this.initForm();
    this.setControls();
    this.setupHorarioControl();
    this.registerContactoListener();
    this.registerTipoListener();
    this.registerDireccionListener();
    // this.registerClienteListener();
    this.direcciones$ = this.parent.get('cliente').valueChanges.pipe(
      map((cte) => findDirecciones(cte)),
      takeUntil(this.destroy$)
    );
  }

  private initForm() {
    this.form = this.parent.get('envio') as FormGroup;
    this.form.status === 'INVALID' ? this.form.disable() : this.form.enable();
  }

  private setControls() {
    this.controls = {
      tipo: this.form.controls.tipo,
      transporte: this.form.controls.transporte,
      contacto: this.form.controls.contacto,
      telefono: this.form.controls.telefono,
      horario: this.form.controls.horario,
      fechaDeEntrega: this.form.controls.fechaDeEntrega,
    };
  }

  private setupHorarioControl() {
    const horario: AbstractControl = this.form.get('horario');
    horario.setValidators(HorarioValidator);
    horario.updateValueAndValidity();
  }

  private registerContactoListener() {
    this.contacto.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        const res = words(val)
          .map((item) => capitalize(item))
          .join(' ');
        this.form.patchValue(
          { contacto: res },
          { emitEvent: false, onlySelf: true }
        );
      });
  }

  private registerTipoListener() {
    this.tipo.valueChanges
      .pipe(
        map((t) => t === 'FORANEO' || t === 'OCURRE'),
        takeUntil(this.destroy$)
      )
      .subscribe((valid) =>
        valid ? this.transporte.enable() : this.transporte.disable()
      );
  }

  private registerDireccionListener() {
    this.form
      .get('direccion')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value: ClienteDireccion) => {
        if (value) {
          const { codigoPostal } = value.direccion;
          this.catalogos.buscarSucursalPorZip(codigoPostal).subscribe((val) => {
            if (val) {
              const rootForm = this.form.parent;
              if (rootForm) {
                rootForm.get('sucursalEntity').setValue(val);
              }
            }
          });
        }
      });
  }

  setEnvio({ detail: { checked } }: any) {
    checked ? this.form.enable() : this.form.disable();
    this.parent.markAsDirty();
  }

  get tipo(): AbstractControl {
    return this.controls.tipo;
  }
  get transporte(): AbstractControl {
    return this.controls.transporte;
  }
  get contacto(): AbstractControl {
    return this.controls.contacto;
  }
  get cliente(): Partial<Cliente> {
    return this.parent.get('cliente').value;
  }
}
