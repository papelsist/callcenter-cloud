import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Pedido } from '@papx/models';
import { map, shareReplay, take } from 'rxjs/operators';

import orderBy from 'lodash-es/orderBy';
import { LoadingController } from '@ionic/angular';

@Injectable()
export class PedidosLogFacade {
  pendientes$ = this.afs
    .collection<Pedido>('pedidos', (ref) =>
      ref
        .where('atendido', '==', false)
        .where('cierre.replicado', '!=', null)
        .limit(10)
    )
    .valueChanges({ idField: 'id' })
    .pipe(map((pedidos) => orderBy(pedidos, 'folio', 'desc')))
    .pipe(shareReplay(1));

  constructor(
    private afs: AngularFirestore,
    private loadingController: LoadingController
  ) {}

  async actalizarStatusDePedidos(pedidos: Pedido[]) {
    const loading = await this.loadingController.create({
      message: 'Procesando',
    });
    try {
      await loading.present();
      const conEnvio = pedidos.filter((item) => item.envio);
      const sinEnvio = pedidos.filter((item) => !item.envio);
      console.debug('Actualizando %f pedidos SIN evnio', sinEnvio.length);
      sinEnvio.forEach(async (item) => {
        if (item.factura) {
          await this.afs.doc(`pedidos/${item.id}`).update({ atendido: true });
        }
      });
      console.debug('Actualizando %f pedidos CON evnio', conEnvio.length);
      conEnvio.forEach(async (item) => {
        if (item.embarqueLog && item.embarqueLog.recepcion) {
          await this.afs.doc(`pedidos/${item.id}`).update({ atendido: true });
        }
      });
      await loading.dismiss();
    } catch (error) {
      await loading.dismiss();
      console.debug('Error: ', error);
    }
  }
}
