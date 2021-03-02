import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ClienteDireccion, Direccion } from '@papx/models';
import { DireccionFormComponent } from '../direccion-form/direccion-form.component';

@Component({
  selector: 'papx-direccion-entrega',
  templateUrl: 'direccion-entrega.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DireccionEntregaComponent implements OnInit {
  @Input() direccionEntrega: ClienteDireccion;
  form: FormGroup;
  @ViewChild(DireccionFormComponent) direccionForm: DireccionFormComponent;
  constructor(private fb: FormBuilder, private modal: ModalController) {}

  ngOnInit() {
    this.form = this.buildForm(this.direccionEntrega);
  }

  private buildForm(de: ClienteDireccion): FormGroup {
    return this.fb.group({
      contacto: [de?.contacto],
      telefono: [de?.telefono],
      email: [de?.email, [Validators.email]],
      // horario: [
      //   { horaInicial: '08:00', horaFinal: '19:00' },
      //   [Validators.required],
      // ],
      notificaciones: [],
    });
  }

  async close() {
    await this.modal.dismiss();
  }

  canSave() {
    const f1 = this.form.valid && this.direccionForm?.form?.valid;
    const f3 = this.form.dirty || this.direccionForm?.form?.dirty;
    return f1 && f3;
  }

  getThisValue() {
    const { contacto, ...rest } = this.form.value;
    if (contacto) {
      return {
        ...rest,
        contacto: contacto.toUpperCase(),
      };
    }
    return rest;
  }

  submit() {
    const validas = this.form.valid && this.direccionForm?.form?.valid;
    if (validas) {
      const direccion: Direccion = this.direccionForm.form.getRawValue();
      const res = {
        ...this.getThisValue(),
        direccion: {
          ...this.direccionForm.form.getRawValue(),
        },
      };
      this.modal.dismiss(res);
    }
  }
}
