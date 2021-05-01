import { Component, OnInit } from '@angular/core';
import { Pedido } from '@papx/models';

import firebase from 'firebase/app';
import { Observable } from 'rxjs';

import { VentasDataService } from '../@data-access';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.page.html',
  styleUrls: ['./facturas.page.scss'],
})
export class FacturasPage implements OnInit {
  facturas$ = this.service.fetchFacturas();
  constructor(private service: VentasDataService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.facturas$ = this.service.fetchFacturas();
  }

  onFilter() {}

  getDate(item: any) {
    if (item instanceof firebase.firestore.Timestamp) {
      const tt = item as firebase.firestore.Timestamp;
      return tt.toDate().toISOString();
    } else {
      return item;
    }
  }
}
