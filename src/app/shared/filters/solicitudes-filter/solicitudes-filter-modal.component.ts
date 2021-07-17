import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'papx-solicitudes-filter-modal',
  templateUrl: './solicitudes-filter-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudesFilterModalComponent implements OnInit {
  @Input() filter = null;
  form: FormGroup = this.fb.group({
    importeInicial: [],
    importeFinal: [],
    sucursal: [],
    solicito: [],
  });
  constructor(
    private modalController: ModalController,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    if (this.filter) {
      this.form.patchValue(this.filter);
    }
  }

  async close() {
    await this.modalController.dismiss();
  }

  async submit() {
    await this.modalController.dismiss(this.form.value);
  }
}
