import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { PedidoCreateDto, PedidoDet } from '@papx/models';

@Component({
  selector: 'papx-pedido-create-form',
  templateUrl: './pcreate-form.component.html',
  styleUrls: ['./pcreate-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PedidoCreateFormComponent implements OnInit {
  @Output() save = new EventEmitter<PedidoCreateDto>();
  @Output() addItem = new EventEmitter();
  @Input() data: Partial<PedidoCreateDto> = {};
  @Input() partidas: Partial<PedidoDet[]> = [];
  form = this.buildForm();
  constructor() {}

  ngOnInit() {
    this.form.patchValue(this.data);
  }

  private buildForm(): FormGroup {
    return new FormGroup({
      cliente: new FormControl(null, Validators.required),
      sucursal: new FormControl(null, Validators.required),
      formaDePago: new FormControl(null, Validators.required),
      tipo: new FormControl(null, Validators.required),
      moneda: new FormControl(null, Validators.required),
      comprador: new FormControl(null),
      comentario: new FormControl(null),
    });
  }

  get canSubmit() {
    return this.form.valid;
  }

  submit() {
    if (this.canSubmit) {
      const data = this.form.value;
      this.save.emit(data);
    }
  }
}
