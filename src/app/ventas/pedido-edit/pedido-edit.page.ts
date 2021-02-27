import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Pedido, User } from '@papx/models';
import { PedidosFacade } from '../@data-access/+state';

@Component({
  selector: 'app-pedido-edit',
  templateUrl: './pedido-edit.page.html',
  styleUrls: ['./pedido-edit.page.scss'],
})
export class PedidoEditPage implements OnInit {
  errors: any;
  warnings: any[];
  vm$ = this.facade.vm$;
  constructor(public facade: PedidosFacade, private router: Router) {}

  ngOnInit() {}

  async onSave(id: string, pedido: Partial<Pedido>, user: User) {
    pedido.status = 'COTIZACION';
    await this.facade.updatePedido(id, pedido, user);
    this.router.navigate(['/', 'ventas', 'cotizaciones']);
  }

  async onCerrar(id: string, pedido: Partial<Pedido>, user: User) {
    pedido.status =
      pedido.warnings && pedido.warnings.length > 0
        ? 'POR_AUTORIZAR'
        : 'COTIZACION';
    pedido.updateUser = user.displayName; // backward compatibility
    await this.facade.updatePedido(id, pedido, user);
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
