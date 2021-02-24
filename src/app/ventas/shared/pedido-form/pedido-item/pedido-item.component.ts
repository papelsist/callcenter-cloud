import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
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
  constructor() {}

  ngOnInit() {}

  getLabel() {
    return `${this.item.clave} - ${this.item.descripcion} (${this.item.unidad})`;
  }
}
