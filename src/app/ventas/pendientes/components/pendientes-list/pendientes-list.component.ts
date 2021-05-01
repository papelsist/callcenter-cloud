import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

import { formatDistanceToNow, parseISO, differenceInHours } from 'date-fns';

import { es } from 'date-fns/locale';

import { Pedido } from '@papx/models';
import firebase from 'firebase/app';

@Component({
  selector: 'papx-pendientes-list',
  templateUrl: './pendientes-list.component.html',
  styleUrls: ['./pendientes-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PendientesListComponent implements OnInit {
  @Input() pedidos: Pedido[] = [];
  @Output() regresar = new EventEmitter();
  @Output() autorizar = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  getHoras(item: any) {}

  fromNow(item: any) {
    if (item instanceof firebase.firestore.Timestamp) {
      const tt = item as firebase.firestore.Timestamp;
      return formatDistanceToNow(tt.toDate(), {
        addSuffix: true,
        locale: es,
      });
    } else {
      return 'pending';
    }
  }

  getRetraso(item: any) {
    let fecha;
    if (item instanceof firebase.firestore.Timestamp) {
      const tt = item as firebase.firestore.Timestamp;
      fecha = tt.toDate();
    } else {
      fecha = parseISO(item);
    }

    return differenceInHours(new Date(), fecha);
  }

  getRetrasoColor(pedido: Partial<Pedido>) {
    if (pedido.cerrado) {
      const retrasoHoras = differenceInHours(
        new Date(),
        parseISO(pedido.cerrado)
      );
      if (retrasoHoras <= 1) {
        return 'success';
      } else if (retrasoHoras > 1 && retrasoHoras < 2) {
        return 'warning';
      } else {
        return 'danger';
      }
    } else return '';
  }
}
