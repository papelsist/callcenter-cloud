import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { PedidoDet } from '@papx/models';

@Component({
  selector: 'papx-pedido-item-list',
  templateUrl: 'pedido-item-list.component.html',
  styleUrls: ['pedido-item-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PedidoItemListComponent implements OnInit {
  @Input() items: Partial<PedidoDet>[] = [];
  @Output() addItem = new EventEmitter();
  @Input() disabled = false;
  @Input() fabButton = true;
  constructor() {}

  ngOnInit() {}
}
