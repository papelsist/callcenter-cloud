import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { IonSearchbar, ModalController } from '@ionic/angular';

import { Cliente } from '@papx/models';

import { BehaviorSubject, Observable, of } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter as xfilter,
  map,
  switchMap,
} from 'rxjs/operators';

import includes from 'lodash-es/includes';
import filter from 'lodash-es/filter';

import { ClientesDataService } from '../@data-access/clientes-data.service';

@Component({
  selector: 'papelx-cliente-selector',
  templateUrl: './cliente-selector.component.html',
  styleUrls: ['./cliente-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClienteSelectorComponent implements OnInit, AfterViewInit {
  filter$ = new BehaviorSubject('');
  clientes$;
  @ViewChild(IonSearchbar) searchBar: IonSearchbar;

  constructor(
    private modalCtrl: ModalController,
    private service: ClientesDataService
  ) {}

  ngOnInit() {
    this.clientes$ = this.filter$.pipe(
      map((term) => term.toUpperCase()),
      debounceTime(100),
      distinctUntilChanged(),
      xfilter((term) => term.length > 2),
      switchMap((term) => this.lookUp(term)),
      catchError((err) => this.handleError(err))
    );
  }

  lookUp(value: string) {
    return this.service.clientesCache$.pipe(
      map((rows) =>
        filter(rows, (item) =>
          includes(item.nombre.toLowerCase(), value.toLowerCase())
        )
      )
    );
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.searchBar.setFocus();
    }, 600);
  }

  close() {
    this.modalCtrl.dismiss(null, null, 'cliente-selector-modal');
  }

  select(c: Partial<Cliente>) {
    this.service.findById(c.id).subscribe(
      (found) => {
        this.modalCtrl.dismiss(found);
      },
      (err) => this.modalCtrl.dismiss(null)
    );
  }

  onSearch({ target: { value } }: any) {
    this.filter$.next(value);
  }

  onEnter(event: any) {
    this.filter$.next(event);
  }

  clienteNuevo() {
    this.modalCtrl.dismiss('CLIENTE_NUEVO');
  }

  handleError(err: any) {
    console.error('Error buscando clientes, ', err);
    return of([]);
  }
}
