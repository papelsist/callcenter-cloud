import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Pedido } from '@papx/models';

@Component({
  selector: 'papx-facturas-list',
  templateUrl: './facturas-list.component.html',
  styleUrls: ['./facturas-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacturasListComponent implements OnInit {
  @Input() facturas: Pedido[] = [];
  constructor() {}

  ngOnInit() {}
}
