import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Pedido, PedidoDet } from '@papx/models';

@Component({
  selector: 'papx-pedido-items',
  templateUrl: './pedido-items.component.html',
  styleUrls: ['./pedido-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PedidoItemsComponent implements OnInit {
  @Input() items: Partial<PedidoDet>[] = [];
  @Input() pedido: Pedido;
  constructor() {}

  ngOnInit() {}
}
