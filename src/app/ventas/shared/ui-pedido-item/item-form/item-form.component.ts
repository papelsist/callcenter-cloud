import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import {
  PedidoDet,
  Producto,
  PedidoItemParams,
  TipoDePedido,
} from '@papx/models';
import { ProductoController } from '@papx/shared/productos/producto-selector';

import { buildForm, getParams } from './item-factory';

@Component({
  selector: 'papx-pedido-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemFormComponent implements OnInit {
  @Input() data: Partial<PedidoDet> = { cantidad: 0 };
  @Input() params: PedidoItemParams = getParams();
  @Input() tipo: TipoDePedido;
  existencia = {};

  form: FormGroup = buildForm(this.fb);
  controls = {
    tantos: this.form.get('corte.tantos'),
    producto: this.form.get('producto'),
    descripcion: this.form.get('descripcion'),
    precio: this.form.get('precio'),
    cantidad: this.form.get('cantidad'),
    instruccion: this.form.get('corte.instruccion'),
    instruccionEspecial: this.form.get('corte.instruccionEspecial'),
    corte: this.form.get('corte'),
  };
  constructor(
    private fb: FormBuilder,
    private productoController: ProductoController,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.form.controls;
  }

  findProductByClave(clave: string) {
    // this.lookupByClave(clave);
  }

  async findProducto() {
    const producto = await this.productoController.findProducto();
    if (producto) {
      this.selectNewProduct(producto);
    }
  }

  selectNewProduct(prod: Partial<Producto>) {
    const { producto, descripcion, precio } = this.controls;
    const { precioCredito, precioContado } = prod;
    producto.setValue(prod);
    descripcion.setValue(prod.descripcion);
    precio.setValue(this.isCredito ? precioCredito : precioContado);
    this.existencia = this.producto.existencia;
    console.log('Producto: ', this.producto);
    console.log('Existencias: ', this.producto.existencia);

    this.cd.markForCheck();
  }

  get producto(): Partial<Producto> {
    return this.form.get('producto').value;
  }

  get isCredito() {
    return this.tipo === TipoDePedido.CREDITO;
  }

  cancel() {}
  onSubmit() {}
}
