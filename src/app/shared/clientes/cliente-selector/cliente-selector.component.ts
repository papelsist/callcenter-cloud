import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ModalController } from '@ionic/angular';

import { Cliente } from '@papx/models';

import { BehaviorSubject, combineLatest, from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClientesDataService } from '../@data-access/clientes-data.service';

@Component({
  selector: 'papelx-cliente-selector',
  templateUrl: './cliente-selector.component.html',
  styleUrls: ['./cliente-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClienteSelectorComponent implements OnInit {
  @Input() tipo: 'CREDITO' | 'CONTADO' | 'TODOS' = 'CREDITO';
  filter$ = new BehaviorSubject('');
  clientes$: Observable<Partial<Cliente>[]>;

  constructor(
    private modalCtrl: ModalController,
    private service: ClientesDataService
  ) {}

  ngOnInit() {
    if (this.tipo === 'CREDITO') {
      this.clientes$ = this.service.clientesCredito$;
      this.clientes$ = combineLatest([
        this.filter$,
        this.service.clientesCredito$,
      ]).pipe(
        map(([term, clientes]) =>
          clientes.filter((item) =>
            item.nombre.toLowerCase().includes(term.toLowerCase())
          )
        )
      );
    } else {
      this.clientes$ = from([]);
    }
  }

  close() {
    this.modalCtrl.dismiss(null, null, 'cliente-selector-modal');
  }

  select(c: Partial<Cliente>) {
    this.modalCtrl.dismiss(c);
  }

  onSearch({ target: { value } }: any) {
    this.filter$.next(value);
  }
}
