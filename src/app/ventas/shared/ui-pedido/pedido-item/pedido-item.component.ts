import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'papx-pedido-item',
  templateUrl: 'pedido-item.component.html',
  styleUrls: ['pedido-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PedidoItemComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
