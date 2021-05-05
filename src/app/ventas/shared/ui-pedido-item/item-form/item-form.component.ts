import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IonInput } from '@ionic/angular';
import { BaseComponent } from '@papx/core';

import {
  PedidoDet,
  Producto,
  TipoDePedido,
  PedidoSummary,
  Almacen,
} from '@papx/models';
import { ProductoController } from '@papx/shared/productos/producto-selector';

// import { isString } from 'lodash-es';
import toNumber from 'lodash-es/toNumber';

import { combineLatest, Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { buildForm, buildPedidoItem, calcularImportes } from './item-factory';

@Component({
  selector: 'papx-pedido-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemFormComponent extends BaseComponent implements OnInit {
  @Input() item: Partial<PedidoDet>;
  @Input() tipo: TipoDePedido;
  @Input() sucursal: string;
  @Output() save = new EventEmitter<Partial<PedidoDet>>();
  existencia: { [key: string]: Almacen } = {};
  warning: any;

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

  totales$: Observable<PedidoSummary> = combineLatest([
    this.controls.producto.valueChanges.pipe(distinctUntilChanged()),
    this.controls.cantidad.valueChanges.pipe(
      debounceTime(600),
      distinctUntilChanged()
    ),
  ]).pipe(
    map(([producto, cantidad]) =>
      calcularImportes(producto, cantidad, this.tipo)
    )
  );

  @ViewChild('tantosComponent') tantosElement: IonInput;
  @ViewChild('cantidad') cantidadEl: IonInput;
  constructor(
    private fb: FormBuilder,
    private productoController: ProductoController,
    private cd: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
    if (this.item) {
      console.log('PTDA: ', this.item);
      const { producto, cantidad, precio, importe, corte } = this.item;
      this.form.patchValue({ producto, cantidad, precio, importe });
      if (corte) {
        this.form.get('corte').patchValue(corte);
      }
      this.updateExistenciasPanel();
    }
    this.addListeners();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.tantosElement.setFocus();
    }, 600);
  }

  findProductByClave(clave: any) {
    // console.log('Buscando por clave: ', clave);
    this.productoController.findByClave(clave).subscribe(async (p) => {
      // console.log('Found: ', p);
      if (p) {
        this.selectNewProduct(p);
        await this.cantidadEl.setFocus();
        const ne = await this.cantidadEl.getInputElement();
        ne.select();
      }
    });
  }

  async findProducto() {
    const producto = await this.productoController.findProducto();
    if (producto) {
      this.findProductByClave(producto.clave);
    }
  }

  selectNewProduct(prod: Partial<Producto>) {
    const { producto, descripcion, precio } = this.controls;
    const { precioCredito, precioContado } = prod;
    producto.setValue(prod);
    descripcion.setValue(prod.descripcion);
    precio.setValue(this.isCredito ? precioCredito : precioContado);
    this.updateExistenciasPanel();
  }

  updateExistenciasPanel() {
    if (this.producto && this.producto.existencia) {
      this.existencia = this.producto.existencia;
      this.cd.markForCheck();
    }
  }

  get producto(): Partial<Producto> {
    return this.form.get('producto').value;
  }
  get cantidad(): number {
    return this.controls.cantidad.value;
  }

  get isCredito() {
    return this.tipo === TipoDePedido.CREDITO;
  }

  onSubmit() {
    if (this.form.valid) {
      if (this.item) {
        const updated = { ...this.item, ...this.form.getRawValue() };
        this.save.emit(updated);
      } else {
        const item = buildPedidoItem(this.tipo, this.form.getRawValue());
        this.save.emit(item);
      }
    }
  }

  @HostListener('keydown.f2', ['$event'])
  onHotKeyFindFactura(event: KeyboardEvent) {
    event.preventDefault();
    this.findProducto();
  }

  onEnter() {
    this.onSubmit();
  }

  private addListeners() {
    this.totales$
      .pipe(takeUntil(this.destroy$))
      .subscribe((importes) => this.form.patchValue(importes));
    this.disponibilidadListener();
  }

  private disponibilidadListener() {
    this.controls.cantidad.valueChanges
      .pipe(debounceTime(600), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((cantidad) => {
        if (cantidad) {
          const faltante = this.resolverFaltante();
          this.form.get('faltante').setValue(faltante);
        }
      });
  }

  getDisponible(): number {
    if (this.existencia) {
      const almacen = this.existencia[this.sucursal.toLowerCase()];
      if (almacen) {
        return toNumber(almacen.cantidad);
      }
      // const disponible = Object.keys(this.existencia).reduce(
      //   (p, c) => p + toNumber(this.existencia[c].cantidad),
      //   0.0
      // );
      // return disponible;
    }
    return 0;
  }

  private resolverFaltante() {
    const can = this.cantidad;
    const dis = this.getDisponible();
    const faltante = dis > can ? 0 : can - dis;
    return faltante;
  }
}
