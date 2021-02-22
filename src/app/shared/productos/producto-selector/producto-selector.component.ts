import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { IonSearchbar, ModalController } from '@ionic/angular';

import { BehaviorSubject, Observable } from 'rxjs';
import { map, startWith, withLatestFrom } from 'rxjs/operators';

import { Producto } from '@papx/models';
@Component({
  selector: 'sxcc-producto-selector',
  templateUrl: './producto-selector.component.html',
  styleUrls: ['./producto-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductoSelectorComponent implements OnInit {
  filter$ = new BehaviorSubject<string>('');

  @Input() productos$: Observable<Producto[]>; // this.service.activos$;
  @Input() tipo: 'CREDITO' | 'CONTADO';

  @ViewChild(IonSearchbar) searchBar: IonSearchbar;

  filteredProducts$: Observable<Producto[]>;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    this.filteredProducts$ = this.filter$.pipe(
      startWith(''),
      withLatestFrom(this.productos$),
      map(([term, productos]) => {
        return !term
          ? []
          : productos.filter(
              (item) =>
                item.clave.toLowerCase().includes(term.toLowerCase()) ||
                item.descripcion.toLowerCase().includes(term.toLowerCase())
            );
      })
    );
  }

  async ionViewDidEnter() {
    await this.searchBar.setFocus();
  }

  search({ target: { value } }: any) {
    this.filter$.next(value);
  }

  select(prod: Partial<Producto>) {
    this.modalCtrl.dismiss(prod);
  }
}
