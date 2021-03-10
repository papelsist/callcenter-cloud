import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  ModalController,
  PopoverController,
} from '@ionic/angular';
import { TipoDePedido, DescuentoPorVolumen } from '@papx/models';

import { PcreateFacade } from '../create-form/pcreate.facade';
import { DescuentosModalComponent } from './descuentos-modal.component';
import { PedidoOptionsComponent } from './pedido-options.component';

@Component({
  selector: 'papx-pedido-options-button',
  template: `
    <ion-button (click)="showOptions($event)">
      <ion-icon
        name="ellipsis-vertical"
        slot="icon-only"
        ios="ellipsis-horizontal"
        md="ellipsis-vertical"
      ></ion-icon>
    </ion-button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PedidoOptionsButtonComponent implements OnInit {
  @Output() cerrar = new EventEmitter();
  @Input() descuentos: DescuentoPorVolumen[] = [];

  constructor(
    private popoverController: PopoverController,
    private facade: PcreateFacade,
    private actionSheet: ActionSheetController,
    private alert: AlertController,
    private modal: ModalController
  ) {}

  ngOnInit() {}

  async showOptions(ev: any) {
    const action = await this.actionSheet.create({
      header: 'Operaciones con el pedido ..',
      animated: true,
      translucent: true,
      buttons: [
        ...this.buildOptionButtons(),
        {
          text: 'Cancelar',
          role: 'cancel',
        },
      ],
    });
    await action.present();
  }

  private buildOptionButtons() {
    let options = [];
    if (this.facade.getPedido()) {
      options = [...this.editOptions()];
    } else {
      options = [...this.createOptions()];
    }
    if (this.facade.tipo !== TipoDePedido.CREDITO) {
      options.push(this.buildDescuentosPorVolumenOption());
    }
    return options;
  }

  private createOptions() {
    const options = [
      {
        text: 'Cliente nuevo',
        role: 'selected',
        icon: 'person-add',
        handler: () => this.facade.registrarClienteNuevo(),
      },
      {
        text: 'Descuento especial',
        role: 'selected',
        icon: 'archive',
        handler: () => this.setDescuentoEspecial(),
      },
    ];
    return options;
  }

  private buildDescuentosPorVolumenOption() {
    return {
      text: 'Descuentos (Vol)',
      icon: 'archive',
      handler: () => this.showDescuentos(),
    };
  }

  private editOptions() {
    return [
      {
        text: 'Cliente nuevo',
        role: 'selected',
        icon: 'person-add',
        handler: () => this.facade.registrarClienteNuevo(),
      },
      {
        text: 'Descuento especial',
        role: 'selected',
        icon: 'archive',
        handler: () => this.setDescuentoEspecial(),
      },
      {
        text: 'Cerrar pedido',
        role: 'selected',
        icon: 'checkmark-done',
        handler: () => this.cerrar.emit(),
      },
      {
        text: 'Eliminar pedido',
        role: 'destructive',
        icon: 'trash',
        handler: () => console.log('Eliminar'),
      },
    ];
  }

  /**
   * TODO Mover a componente
   */
  async setDescuentoEspecial() {
    if (this.facade.tipo === TipoDePedido.CREDITO) return; // No procede
    const alert = await this.alert.create({
      header: 'Descuento especial',
      message: 'Registre el descuento',
      inputs: [
        {
          type: 'number',
          placeholder: 'Descuento',
          tabindex: 99,
          name: 'descuento',
          max: 40,
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Aceptar',
          role: '',

          handler: (value: any) => {
            console.log('Aplicando descuento especial: ', value);
            this.facade.setDescuentoEspecial(value.descuento);
          },
        },
      ],
    });
    await alert.present();
  }

  async showDescuentos() {
    /*
    const modal = await this.modal.create({
      component: DescuentosModalComponent,
      componentProps: { descuentos: this.descuentos },
      animated: true,
      cssClass: 'descuentos-modal',
      mode: 'ios',
    });
    await modal.present();
    */
    const modal = await this.popoverController.create({
      component: DescuentosModalComponent,
      componentProps: { descuentos: this.descuentos },
      animated: true,
      mode: 'md',
      cssClass: 'menu',
    });
    await modal.present();
  }
}
