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
  filter,
  map,
  switchMap,
} from 'rxjs/operators';
import { ClientesDataService } from '../@data-access/clientes-data.service';

@Component({
  selector: 'papelx-cliente-selector',
  templateUrl: './cliente-selector.component.html',
  styleUrls: ['./cliente-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClienteSelectorComponent implements OnInit, AfterViewInit {
  filter$ = new BehaviorSubject('');
  clientes$: Observable<Partial<Cliente>[]>;
  @ViewChild(IonSearchbar) searchBar: IonSearchbar;

  constructor(
    private modalCtrl: ModalController,
    private service: ClientesDataService
  ) {}

  ngOnInit() {
    this.clientes$ = this.filter$.pipe(
      map((term) => term.toUpperCase()),
      debounceTime(400),
      distinctUntilChanged(),
      filter((term) => term.length > 3),
      switchMap((term) => this.service.searchClientes(term)),
      catchError((err) => this.handleError(err))
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
    this.modalCtrl.dismiss(c);
  }

  onSearch({ target: { value } }: any) {
    // if (this.tipo === 'CREDITO') this.filter$.next(value);
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
