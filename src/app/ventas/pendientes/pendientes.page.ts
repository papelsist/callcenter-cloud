import { Component, OnInit } from '@angular/core';
import { VentasDataService } from '../@data-access';

import firebase from 'firebase/app';

import { formatDistanceToNow, parseISO, differenceInHours } from 'date-fns';
import { es } from 'date-fns/locale';
import isEmty from 'lodash-es/isEmpty';

import { Pedido, User } from '@papx/models';
import { PendientesController } from './pendientes.controller';
import { AuthService } from '@papx/auth';

@Component({
  selector: 'app-pendientes',
  templateUrl: './pendientes.page.html',
  styleUrls: ['./pendientes.page.scss'],
})
export class PendientesPage implements OnInit {
  pedidos$ = this.service.pendientes$;
  user$ = this.auth.user$;

  constructor(
    private service: VentasDataService,
    private auth: AuthService,
    private controller: PendientesController
  ) {}

  ngOnInit() {}

  onFilter(event: any) {}

  getDate(item: any) {
    if (item instanceof firebase.firestore.Timestamp) {
      const tt = item as firebase.firestore.Timestamp;
      return tt.toDate().toISOString();
    }
  }

  getHoras(item: any) {}

  fromNow(item: any) {
    if (item instanceof firebase.firestore.Timestamp) {
      const tt = item as firebase.firestore.Timestamp;
      return formatDistanceToNow(tt.toDate(), {
        addSuffix: true,
        locale: es,
      });
    } else {
      return 'pending';
    }
  }

  getRetraso(item: any) {
    let fecha;
    if (item instanceof firebase.firestore.Timestamp) {
      const tt = item as firebase.firestore.Timestamp;
      fecha = tt.toDate();
    } else {
      fecha = parseISO(item);
    }

    return differenceInHours(new Date(), fecha);
  }

  getRetrasoColor(pedido: Partial<Pedido>) {
    if (pedido.cerrado) {
      const retrasoHoras = differenceInHours(
        new Date(),
        pedido.cerrado.toDate()
      );
      if (retrasoHoras <= 1) {
        return 'success';
      } else if (retrasoHoras > 1 && retrasoHoras < 2) {
        return 'warning';
      } else {
        return 'danger';
      }
    } else return '';
  }

  async autorizar(pedido: Pedido, user: User) {
    const { autorizar, comentario } = await this.controller.autorizar(pedido);

    if (autorizar && !isEmty(comentario)) {
      await this.controller.starLoading();
      try {
        await this.service.autorizarPedido(pedido, comentario, user);
        await this.controller.stopLoading();
      } catch (error) {
        await this.controller.stopLoading();
        this.controller.handelError(error);
      }
    }
  }

  async regresar(pedido: Pedido, user: User) {
    const res = await this.controller.regresar(pedido);
    if (res) {
      await this.controller.starLoading();
      try {
        await this.service.regresarPedido(pedido.id, user);
        await this.controller.stopLoading();
      } catch (error) {
        await this.controller.stopLoading();
        this.controller.handelError(error);
      }
    }
  }
}
