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
  selector: 'papx-pedido-item',
  templateUrl: 'pedido-item.component.html',
  styleUrls: ['pedido-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PedidoItemComponent implements OnInit {
  @Input() item: Partial<PedidoDet>;
  @Input() index: number;
  @Input() detalle = true;
  @Input() disabled = false;
  @Output() selection = new EventEmitter<Partial<PedidoDet>>();
  constructor() {}

  ngOnInit() {}

  getLabel() {
    return `${this.item.clave} - ${this.item.descripcion} (${this.item.unidad})`;
  }
  onSelection() {
    if (!this.disabled) {
      this.selection.emit(this.item);
    }
  }
}
