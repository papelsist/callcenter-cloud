import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'papx-xcreate-pedido-form',
  template: `
    <form novalidate onSubmit="submit()" [formGroup]="form">
      <ion-item>
        <ion-label position="floating">Cliente</ion-label>
        <ion-input formControlName="cliente"></ion-input>
      </ion-item>
      <div>
        <papx-producto-control
          formControlName="producto"
        ></papx-producto-control>
      </div>
    </form>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class XpedidoCreateFormComponent implements OnInit {
  form = this.buildForm();
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.buildForm();
  }

  private buildForm() {
    return this.fb.group({
      cliente: [null, Validators.required],
      nombre: [null, [Validators.required]],
      tipo: [null, Validators.required],
      formaDePago: [null, [Validators.required, Validators.minLength(5)]],
      partidas: this.fb.array([]),
      producto: [null],
      // sucursal: new FormControl(null, Validators.required),
      // sucursalId: new FormControl(null),
      // socio: new FormControl(null),
      // sucursalEntity: new FormControl(null, Validators.required),
      // formaDePago: new FormControl(FormaDePago.EFECTIVO, Validators.required),
      // tipo: new FormControl(TipoDePedido.CONTADO, Validators.required),
      // moneda: new FormControl(
      //   { value: 'MXN', disabled: true },
      //   Validators.required
      // ),
      // comprador: new FormControl(null, Validators.maxLength(50)),
      // comentario: new FormControl(null, Validators.maxLength(250)),
      // descuentoEspecial: new FormControl(null),
      // usoDeCfdi: new FormControl(null, Validators.required),
      // cfdiMail: new FormControl(null),
      // envio: createEnvioForm(fb),
      // importe: new FormControl(0.0, Validators.required),
      // descuento: new FormControl(0.0, Validators.required),
      // descuentoImporte: new FormControl(0.0, Validators.required),
      // subtotal: new FormControl(0.0, Validators.required),
      // impuesto: new FormControl(0.0, Validators.required),
      // total: new FormControl(0.0, Validators.required),
      // kilos: new FormControl(0.0),
      // corteImporte: new FormControl(null),
    });
  }
}
