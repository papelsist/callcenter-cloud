import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { BehaviorSubject } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

import { Producto } from '@papx/models';
import { ProductoService } from '../data-access';

@Component({
  selector: 'sxcc-producto-selector',
  templateUrl: './producto-selector.component.html',
  styleUrls: ['./producto-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductoSelectorComponent implements OnInit {
  filter$ = new BehaviorSubject<string>('');

  productos$ = this.service.activos$;

  filteredProducts$ = this.filter$.pipe(
    withLatestFrom(this.productos$),
    map(([term, productos]) => {
      return productos.filter(
        (item) =>
          item.clave.toLowerCase().includes(term.toLowerCase()) ||
          item.descripcion.toLowerCase().includes(term.toLowerCase())
      );
    })
  );

  constructor(
    private service: ProductoService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {}

  search({ target: { value } }) {
    this.filter$.next(value);
  }

  select(prod: Partial<Producto>) {
    this.modalCtrl.dismiss(prod);
  }
}
