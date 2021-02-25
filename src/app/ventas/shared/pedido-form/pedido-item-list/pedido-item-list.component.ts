import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { PedidoDet } from '@papx/models';
import { PcreateFacade } from '../create-form/pcreate.facade';
import { PedidoItemComponent } from '../pedido-item/pedido-item.component';

@Component({
  selector: 'papx-pedido-item-list',
  templateUrl: 'pedido-item-list.component.html',
  styleUrls: ['pedido-item-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PedidoItemListComponent implements OnInit {
  // @Input() items: Partial<PedidoDet>[] = [];
  _items: Partial<PedidoDet>[] = [];
  @Output() addItem = new EventEmitter();
  @Input() fabButton = false;

  @ViewChildren(PedidoItemComponent) children: QueryList<PedidoItemComponent>;

  constructor(private facade: PcreateFacade, private cd: ChangeDetectorRef) {}

  ngOnInit() {}

  onSelection(index: number, item: Partial<PedidoDet>) {
    this.facade.editItem(index, item);
  }

  refresh() {
    if (this.children) {
      this.children.forEach((el) => {
        el.refresh();
      });
    }
    this.cd.markForCheck();
  }

  @Input()
  set items(value: Partial<PedidoDet>[]) {
    this._items = value;
    this.refresh();
  }

  get items() {
    return this._items;
  }

  get disabled() {
    return this.facade.form.disabled;
  }

  async onDeleteItem(index: number) {
    await this.facade.deleteItem(index);
  }
}
