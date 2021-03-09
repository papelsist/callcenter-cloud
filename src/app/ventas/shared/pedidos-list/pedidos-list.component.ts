import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Pedido } from '@papx/models';
import firebase from 'firebase/app';

@Component({
  selector: 'papx-pedidos-list',
  templateUrl: 'pedidos-list.component.html',
  styleUrls: ['pedidos-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PedidosListComponent implements OnInit {
  @Input() pedidos: Partial<Pedido>[] = [];
  @Input() uid: string;
  @Output() selection = new EventEmitter<Partial<Pedido>>();
  @Output() copiar = new EventEmitter<Partial<Pedido>>();
  @Output() cerrar = new EventEmitter<Partial<Pedido>>();
  constructor() {}

  ngOnInit() {}

  getDate(item: any) {
    if (item instanceof firebase.firestore.Timestamp) {
      const tt = item as firebase.firestore.Timestamp;
      return tt.toDate().toISOString();
    }
  }
}
