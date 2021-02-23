import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PedidoDet, TipoDePedido } from '@papx/models';

@Component({
  selector: 'papx-pedido-item-modal',
  templateUrl: './item-modal.component.html',
  styleUrls: ['./item-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemModalComponent implements OnInit {
  @Input() data: Partial<PedidoDet>;
  @Input() tipo: TipoDePedido;
  @Input() sucursal: string;
  constructor(private controller: ModalController) {}

  ngOnInit() {}

  close() {
    this.controller.dismiss();
  }
  onSave(event: any) {
    this.controller.dismiss(event);
  }
}
