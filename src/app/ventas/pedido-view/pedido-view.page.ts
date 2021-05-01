import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Pedido, User } from '@papx/models';

import { combineLatest, EMPTY, of } from 'rxjs';
import { catchError, shareReplay, switchMap, take, map } from 'rxjs/operators';

import { PedidosFacade } from '../@data-access/+state';

@Component({
  selector: 'app-pedido-view',
  templateUrl: './pedido-view.page.html',
  styleUrls: ['./pedido-view.page.scss'],
})
export class PedidoViewPage implements OnInit {
  pedido$ = this.facade.current$;
  pdf$ = this.pedido$.pipe(
    switchMap((p) => {
      if (p.factura) {
        const {
          factura: { serie, folio },
        } = p;
        const ref = this.afs.ref(`cfdis/${serie}-${folio}.pdf`);
        return ref.getDownloadURL();
      } else {
        return of(null);
      }
    }),
    take(1),
    shareReplay(1),
    catchError((err) => {
      console.log('XML Error :', err.message);
      return of(null);
    })
  );
  xml$ = this.pedido$.pipe(
    switchMap((p) => {
      if (p.factura) {
        const {
          factura: { serie, folio },
        } = p;
        const ref = this.afs.ref(`cfdis/${serie}-${folio}.xml`);
        return ref.getDownloadURL();
      } else {
        return of(null);
      }
    }),
    take(1),
    shareReplay(1),
    catchError((err) => {
      console.log('XML Error :', err.message);
      return of(null);
    })
  );
  factura$ = combineLatest([this.pdf$, this.xml$]).pipe(
    map(([pdfUrl, xmlUrl]) => ({ pdfUrl, xmlUrl }))
  );
  user$ = this.facade.userInfo$;

  constructor(public facade: PedidosFacade, private afs: AngularFireStorage) {}

  ngOnInit() {}

  isFactura(pedido: Pedido) {
    return (
      pedido.status === 'FACTURADO' || pedido.status === 'FACTURADO_TIMBRADO'
    );
  }

  async onPrint(event: Pedido, user: User) {
    this.facade.printPedido(event, user);
  }

  sendFactura(pedido: Partial<Pedido>, xmlUrl: string, pdfUrl: string) {
    const target = 'rubencancino6@gmail.com';
    this.facade.sendFacturaByEmail(pedido, target, pdfUrl, xmlUrl);
  }
}
