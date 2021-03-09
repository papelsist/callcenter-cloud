import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { Cliente, Socio, TipoDePedido } from '@papx/models';
import { Observable } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { SocioSelectorComponent } from './socio-selector.component';

@Component({
  selector: 'papx-pedido-form-cliente',
  templateUrl: 'cliente-section.component.html',
  styleUrls: ['cliente-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClienteSectionComponent implements OnInit {
  @Input() parent: FormGroup;
  @Input() disabled = false;
  @Output() changeCliente = new EventEmitter();
  @Output() clienteNuevo = new EventEmitter();

  nombre$: Observable<string>;
  cliente$: Observable<Partial<Cliente>>;
  socio$: Observable<Socio>;
  constructor(
    private alert: AlertController,
    private modalCtrl: ModalController,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.nombre$ = this.parent
      .get('nombre')
      .valueChanges.pipe(startWith(this.parent.get('nombre').value));
    this.cliente$ = this.parent
      .get('cliente')
      .valueChanges.pipe(startWith(this.parent.get('cliente').value));
    this.socio$ = this.parent
      .get('socio')
      .valueChanges.pipe(startWith(this.parent.get('socio').value));
  }

  nombreError() {
    return this.parent.get('nombre').hasError('required')
      ? 'Debe registrar el nombre del cliente de mostrador'
      : this.parent.get('nombre').hasError('minlength')
      ? 'Longitud mínima del nombres es 5 '
      : null;
  }

  socioError() {
    return this.parent.hasError('socioRequerido')
      ? 'Socio de la union requerido'
      : null;
  }

  isMostrador(cte: Partial<Cliente>) {
    return cte.rfc === 'XAXX010101000';
  }

  async editarNombre(event: Event, nombreActual: string) {
    event.stopPropagation();
    const alert = await this.alert.create({
      header: 'Venta Mostrador',
      message: 'Nombre:',
      cssClass: 'pedido-nombre-modal',
      mode: 'ios',
      inputs: [
        {
          type: 'text',
          placeholder: 'Digite el nombre del cliente',
          name: 'nombre',
          value: nombreActual,
          attributes: {
            minlength: 4,
            inputmode: 'text',
            required: true,
          },
          tabindex: 99,
          min: 5,
          handler: (input) => input.value,
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Aceptar',
          role: 'accept',
          handler: (value) => value,
        },
      ],
    });
    await alert.present();
    const { data } = await alert.onWillDismiss<{ nombre: string }>();
    if (data && data.nombre) {
      this.parent.get('nombre').setValue(data.nombre.toUpperCase());
      this.cd.markForCheck();
    }
  }

  requiereSocio(cte: Partial<Cliente>) {
    return cte.rfc === 'UCI840109JU0';
  }

  async buscarSocio(event: Event, cte: Partial<Cliente>) {
    event.stopPropagation();
    const modal = await this.modalCtrl.create({
      component: SocioSelectorComponent,
      componentProps: {},
      mode: 'ios',
      animated: true,
      id: 'socio-selector-modal',
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      const { id, nombre, clave, direccionFiscal } = data;
      this.parent
        .get('socio')
        .setValue({ id, nombre, clave, direccion: direccionFiscal });
    }
  }

  get isContado() {
    return this.parent.get('tipo').value !== TipoDePedido.CREDITO;
  }
}
