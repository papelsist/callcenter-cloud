import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Producto } from '@papx/models';

@Component({
  selector: 'papx-item-producto-field',
  template: `
    <ion-item button detail (click)="selection.emit()">
      <ion-label>
        <h2>{{ descripcion }}</h2>
        <p>
          {{ producto?.linea }}
          <span>
            {{ producto?.unidad }}
          </span>
        </p>
      </ion-label>
      <ion-note slot="end" *ngIf="producto">
        {{ producto.modoVenta === 'B' ? 'Precio bruto' : 'Precio neto' }}
      </ion-note>
    </ion-item>
  `,
})
export class ProductoFieldComponent implements OnInit {
  @Input() producto: Partial<Producto>;
  @Output() selection = new EventEmitter();
  constructor() {}

  ngOnInit() {}

  get descripcion() {
    return this.producto
      ? `(${this.producto.clave}) ${this.producto.descripcion}`
      : 'Seleccione un producto';
  }
}
