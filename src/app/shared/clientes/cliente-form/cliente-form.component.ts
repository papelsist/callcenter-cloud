import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Input,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Cliente } from '@papx/models';
import { DireccionFormComponent } from '@papx/shared/direccion/direccion-form/direccion-form.component';

@Component({
  selector: 'papx-cliente-form',
  templateUrl: 'cliente-form.component.html',
  styleUrls: ['cliente-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClienteFormComponent implements OnInit {
  @Input() cliente: Cliente;
  form: FormGroup;
  @ViewChild(DireccionFormComponent) direccionForm: DireccionFormComponent;

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.form = this.buildForm(this.cliente || {});
  }

  buildForm(cliente: Partial<Cliente>): FormGroup {
    const { nombre, rfc, cfdiMail } = cliente;
    return new FormGroup({
      nombre: new FormControl(
        { value: nombre, disabled: !!nombre },
        { validators: [Validators.required, Validators.minLength(5)] }
      ),
      rfc: new FormControl({ value: rfc, disabled: !!rfc }, [
        Validators.required,
        Validators.minLength(12),
        Validators.maxLength(13),
      ]),
      cfdiMail: new FormControl(cfdiMail, [
        Validators.required,
        Validators.email,
      ]),
    });
  }

  get label() {
    return this.cliente ?? 'Alta de cliente';
  }

  async close() {
    await this.modalController.dismiss();
  }

  get nombre() {
    return this.form.get('nombre');
  }
  get rfc() {
    return this.form.get('rfc');
  }
  get cfdiMail() {
    return this.form.get('cfdiMail');
  }

  isValid(property: string) {
    return this.form.get(property).valid;
  }
  getIconColor(property: string) {
    return this.form.get(property).valid ? 'success' : '';
  }

  getError(property: string, code: string) {
    return this.form.dirty ? this.form.get(property).hasError(code) : null;
  }

  getEmailError() {
    let res = this.form.get('cfdiMail').getError('email');
    res ? res : null;
  }

  getRfcError() {
    if (this.rfc.hasError('required')) return 'El RFC es requerido';
    if (this.rfc.hasError('minlength') || this.rfc.hasError('maxlength')) {
      return 'Debe ser de 12 a 13 posiciones';
    }
    return null;
  }
  getNombreError() {
    if (this.nombre.hasError('required')) return 'El nombre es requerido';
    if (this.nombre.hasError('minlength')) {
      return 'Longitud mínima de 5 caracteres';
    }
    return null;
  }

  submit() {
    if (this.form.valid) {
      const data = this.resolveData();
      this.modalController.dismiss(data);
    }
  }

  canSubmit() {
    return this.form.valid && this.direccionForm.valid;
  }

  resolveData() {
    if (!this.cliente) {
      const { nombre, rfc, cfdiMail } = this.form.value;
      const direccion = this.direccionForm.form.value;

      return {
        nombre: nombre.toUpperCase(),
        rfc: rfc.toUpperCase(),
        cfdiMail: cfdiMail,
        direccion,
      };
    }
  }
}
