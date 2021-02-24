import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { PedidoDet } from '@papx/models';
import { PcreateFacade } from '../create-form/pcreate.facade';

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
  @Input() fabButton = false;
  constructor(private facade: PcreateFacade) {}

  ngOnInit() {}

  onSelection(index: number, item: Partial<PedidoDet>) {
    this.facade.editItem(index, item);
  }
}
