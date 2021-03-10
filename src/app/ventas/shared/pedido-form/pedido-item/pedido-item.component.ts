import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { AlertController } from '@ionic/angular';
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
  @Output() eliminar = new EventEmitter<number>();
  @Output() duplicar = new EventEmitter<number>();
  constructor(private cd: ChangeDetectorRef, private alert: AlertController) {}

  ngOnInit() {}

  getLabel() {
    return `${this.item.clave} - ${this.item.descripcion} (${this.item.unidad})`;
  }

  onSelection() {
    if (!this.disabled && !this.isCargo()) {
      this.selection.emit(this.item);
    }
  }

  refresh() {
    this.cd.markForCheck();
  }

  isCargo() {
    const cve = this.item.producto.clave;
    if (cve === 'CORTE') return true;
    if (cve.includes('MANIOBRA')) return true;
    return false;
  }

  async eliminarItem() {
    const alert = await this.alert.create({
      message: `Partida: ${this.index + 1} Producto: ${this.item.clave}`,
      header: 'Elimiar partida',
      animated: true,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Aceptar',
          role: 'accept',
          handler: () => this.eliminar.emit(this.index),
        },
      ],
    });
    await alert.present();
  }

  async copiarItem() {
    const alert2 = await this.alert.create({
      message: `Partida: ${this.index + 1} Producto: ${this.item.clave}`,
      header: 'Duplicar partida',
      animated: true,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Aceptar',
          role: 'accept',
          handler: () => this.duplicar.emit(this.index),
        },
      ],
    });
    await alert2.present();
  }
}
