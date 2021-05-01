import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Pedido } from '@papx/models';

@Component({
  selector: 'papx-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PedidoComponent implements OnInit {
  @Input() pedido: Pedido;
  items = new Array(10);
  constructor() {}

  ngOnInit() {}
}
