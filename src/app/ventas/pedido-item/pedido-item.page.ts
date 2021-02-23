import { Component, OnInit } from '@angular/core';
import { ItemController } from '../shared/ui-pedido-item';

@Component({
  selector: 'app-pedido-item',
  templateUrl: './pedido-item.page.html',
  styleUrls: ['./pedido-item.page.scss'],
})
export class PedidoItemPage implements OnInit {
  constructor(private itemController: ItemController) {}

  ngOnInit() {}
}
