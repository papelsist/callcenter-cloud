import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Pedido, User } from '@papx/models';
import { PedidosFacade } from '../@data-access/+state';

@Component({
  selector: 'app-pedido-edit',
  templateUrl: './pedido-edit.page.html',
  styleUrls: ['./pedido-edit.page.scss'],
})
export class PedidoEditPage implements OnInit, OnDestroy {
  errors: any;
  warnings: any[];
  vm$ = this.facade.vm$;
  constructor(public facade: PedidosFacade, private router: Router) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.facade.setCurrent(null);
  }

  async onSave(id: string, pedido: Partial<Pedido>, user: User) {
    pedido.status = 'COTIZACION';
    // console.log('Actualizando pedido: ', pedido);
    await this.facade.updatePedido(id, pedido, user);
    this.router.navigate(['/', 'ventas', 'cotizaciones']);
  }

  async onCerrar(id: string, pedido: Partial<Pedido>, user: User) {
    await this.facade.cerrarPedido(id, pedido, user);
    this.router.navigate(['/', 'ventas', 'cotizaciones']);
  }

  onErrors(event: any) {
    this.errors = event;
  }

  onWarnings(warnings: any[]) {
    this.warnings = warnings;
  }

  async showErrors(errors: any) {
    console.log('Mostrar errores: ', errors);
  }
}
