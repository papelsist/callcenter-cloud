import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'papx-pedido-item-list',
  templateUrl: 'pedido-item-list.component.html',
  styleUrls: ['pedido-item-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PedidoItemListComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
