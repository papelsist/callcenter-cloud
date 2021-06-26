import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ChangeDetectorRef,
  AfterViewInit,
  ViewChild,
} from '@angular/core';

import {
  startWith,
  takeUntil,
  tap,
  map,
  distinctUntilChanged,
  finalize,
} from 'rxjs/operators';
import { merge, Observable } from 'rxjs';

import round from 'lodash-es/round';
import toNumber from 'lodash-es/toNumber';

import { BaseComponent } from '@papx/core';
import {
  Cliente,
  FormaDePago,
  Pedido,
  PedidoDet,
  TipoDePedido,
} from '@papx/models';
import { PcreateFacade } from './pcreate.facade';
import { ToastController } from '@ionic/angular';
import { FormatService } from 'src/app/core/services/format.service';
import { LoadingService } from '@papx/common/ui-core';

@Component({
  selector: 'papx-pedido-form',
  templateUrl: './pcreate-form.component.html',
  styleUrls: ['./pcreate-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PcreateFacade],
})
export class PedidoCreateFormComponent
  extends BaseComponent
  implements OnInit, AfterViewInit
{
  @Input() data: Partial<Pedido> = {};
  @Output() save = new EventEmitter<Partial<Pedido>>();
  @Output() cerrarPedido = new EventEmitter<Partial<Pedido>>();
  @Output() imprimir = new EventEmitter();
  @Output() email = new EventEmitter<Partial<Cliente>>();
  @Output() errors = new EventEmitter();
  @Output() warnings = new EventEmitter();
  @Output() delete = new EventEmitter();
  @Output() descuentEspecial = new EventEmitter();

  form = this.facade.form;
  partidas$ = this.facade.partidas$;
  cortes$ = this.facade.cortes$;
  summary$ = this.facade.summary$;
  cliente$: Observable<any>;
  segment = 'partidas';

  errors$ = this.facade.errors$;
  hasErrors$ = this.facade.errors$.pipe(map((errors) => errors.length > 0));

  descuentos$ = this.facade.descuentos$;

  @ViewChild('options') options: any;

  constructor(
    private facade: PcreateFacade,
    private cd: ChangeDetectorRef,
    private toast: ToastController,
    private format: FormatService,
    private loading: LoadingService
  ) {
    super();
  }

  ngOnInit() {
    // this.form.disable({ onlySelf: true, emitEvent: true });
    this.facade.setPedido(this.data);
    this.descuentEspecial.emit(this.data.descuentoEspecial);
    this.addListeners();
    this.facade.actualizarValidaciones();

    // TEMPO
    this.facade.nextDescuento$
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ nextDescuento, netoAcual }) => {
        if (nextDescuento && netoAcual > 0.0) {
          const faltante = round(nextDescuento.inicial - netoAcual);
          const faltantePercent = faltante / nextDescuento.inicial;
          if (faltantePercent < 0.06)
            this.notificar(
              'Alerta: ',
              `Su pedido actual está a solo: ${this.format.formatCurrency(
                faltante
              )} de alcanzar el próximo descuento que es del ${
                nextDescuento.descuento
              } %`,
              0
            );
        }
      });

      this.summary$
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => console.debug('Summary: ', value))
  }

  ngAfterViewInit() {
    // setTimeout(() => this.actualizarExistencias(), 1000);
  }

  getAlmacen(): string {
    const sucursal = this.form.get('sucursal').value;
    let sname = sucursal.toLowerCase();
    if (sname === 'calle 4') sname = 'calle4';
    if (sname === 'vertiz 176') sname = 'vertis176';
    return sname;
  }

  actualizarExistencias() {
    // this.loading.startLoading('Actualizando existencias');

    const partidas: Partial<PedidoDet[]> = [...this.facade.getPartidas()];
    partidas.forEach((item, index) => {
      if (!item.clave.includes('CORTE') && !item.clave.startsWith('MANIOBRA')) {
        this.facade.getExistenciaActual(item).subscribe((prod) => {
          console.log('Actualizando existencia de: %s', item.clave, index);
          const almacen = prod.existencia[this.getAlmacen()];
          console.log('Almacen: ', almacen);
          const cantidad = item.cantidad;

          const disponible = almacen ? toNumber(almacen.cantidad) : 0;
          const faltante = disponible > cantidad ? 0 : cantidad - disponible;
          console.log(
            'Requerido: %f Disponible: %f Faltante: %f',
            cantidad,
            disponible,
            faltante
          );

          item.disponible = disponible;
          item.faltante = faltante;
          this.facade.updateItem(item, index);
          this.facade.actualizarValidaciones();
          this.form.markAsDirty();
          this.cd.markForCheck();
        });
      }
    });
    this.facade.actualizarValidaciones();
    // console.log('Partidas recalculadas: ', partidas);
    // this.loading.stopLoading();
  }

  async actualizarExistencias2() {
    await this.loading.startLoading('Actualizando existencias');

    this.facade.actualizarExistencias().subscribe(
      () => this.loading.stopLoading('Existencias actualizadas'),
      (err) => this.loading.stopLoading()
    );
  }

  imprimirPedido() {
    this.imprimir.emit();
  }

  enviarPedido() {
    this.email.emit(this.form.get('cliente').value);
  }

  ngOnDestroy() {
    this.facade.closeLiveSubscriptions();
    super.ngOnDestroy();
  }

  addListeners() {
    this.cliente$ = this.controls.cliente.valueChanges.pipe(
      startWith(this.cliente) /**Important!  Needs to start with*/
    );
    this.recalculoListener();
    this.sucursalListener();
    this.errorsListener();
    this.clienteListener();
    this.descuentoEspecialListener();
  }

  recalculoListener() {
    merge(
      this.facade.controls.tipo.valueChanges.pipe(
        tap((tipo) => {
          // Side effect para limpiar el descuento especial
          if (tipo === TipoDePedido.CREDITO && this.facade.descuentoEspecial) {
            // this.facade.setDescuentoEspecial(0.0, true); // Sin detonar eventos
            this.form.get('descuentoEspecial').setValue(0.0)
          }
        })
      ),
      this.facade.controls.formaDePago.valueChanges
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.facade.recalcular());
  }

  errorsListener() {
    // this.form.statusChanges
    //   .pipe(
    //     distinctUntilChanged(),
    //     tap(() => this.facade.runWarnings()), // Side effect to run warnings
    //     takeUntil(this.destroy$)
    //   )
    //   .subscribe((status) => {});

    this.facade.errors$
      .pipe(takeUntil(this.destroy$))
      .subscribe((errors) => this.errors.emit(errors));
    this.facade.warnings$
      .pipe(takeUntil(this.destroy$))
      .subscribe((errors) => this.warnings.emit(errors));
  }

  private sucursalListener() {
    this.form
      .get('sucursalEntity')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((s) => {
        if (s) {
          this.form.get('sucursal').setValue(s.nombre);
          this.form.get('sucursalId').setValue(s.id);
          // this.facade.actualizarExistenciasDeSucursal(s.nombre);
        }
      });
  }

  private clienteListener() {
    this.controls.cliente.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged(),
        tap((cte) => this.ajustarTipo(cte))
      )
      .subscribe(() => {});
  }

  private descuentoEspecialListener() {
    this.form
      .get('descuentoEspecial')
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged(),
        tap((value) => this.descuentEspecial.emit(value))
      )
      .subscribe(() => {});
  }

  get canSubmit() {
    return this.form.valid && this.form.dirty;
  }

  submit() {
    if (this.canSubmit) {
      const data = this.facade.resolvePedidoData();
      this.facade.closeLiveSubscriptions();
      this.save.emit(data);
    }
  }

  onCerrar() {
    if (this.form.valid) {
      const data = this.facade.resolvePedidoData();
      this.cerrarPedido.emit(data);
    }
  }

  get controls() {
    return this.facade.controls;
  }

  async addItem() {
    await this.facade.addItem();
  }

  getId(): string {
    return this.data.id;
  }

  getHeaderLabel() {
    if (this.getId()) {
      return `Pedido: ${this.data.folio}`;
    } else {
      return 'Alta de pedido';
    }
  }

  get cliente() {
    return this.form.get('cliente').value;
  }

  async onChangeCliente() {
    await this.facade.cambiarCliente();
    this.cd.markForCheck();
  }

  async onClienteNuevo() {
    await this.facade.registrarClienteNuevo();
    this.cd.markForCheck();
  }

  segmentChanged({ detail: { value } }: any) {
    this.segment = value;
    // this.cd.markForCheck();
  }

  ajustarTipo(cliente: Partial<Cliente>) {
    // Side effect to update other controls
    if (this.form.get('total').value > 0) return;
    if (cliente.credito) {
      if (this.facade.tipo !== TipoDePedido.CREDITO) {
        this.controls.tipo.setValue(TipoDePedido.CREDITO, {
          emitEvent: true,
          onlySelf: true,
        });
        this.controls.formaDePago.setValue(FormaDePago.NO_DEFINIDO, {
          emitEvent: false,
          onlySelf: true,
        });
      }
    } else {
      if (this.facade.tipo === TipoDePedido.CREDITO) {
        this.controls.tipo.setValue(TipoDePedido.CONTADO, {
          emitEvent: true,
          onlySelf: true,
        });
      }
    }
  }

  toogleReordenar() {
    this.facade.toggleReorer();
  }

  async notificar(
    header: string = 'Notificación',
    message: string,
    duration: number
  ) {
    const t = await this.toast.create({
      header,
      message,
      duration,
      animated: true,
      color: 'warning',
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel',
        },
      ],
    });
    await t.present();
  }

  getCartState() {
    return this.facade.resolvePedidoData();
  }

  getFacade() {
    return this.facade;
  }

  showDescuentos() {
    this.options.showDescuentos();
  }
}
