import { Component, OnInit } from '@angular/core';

import firebase from 'firebase/app';

import { VentasDataService } from '../@data-access';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.page.html',
  styleUrls: ['./facturas.page.scss'],
})
export class FacturasPage implements OnInit {
  facturas$ = this.service.facturas$;
  constructor(private service: VentasDataService) {}

  ngOnInit() {}

  onFilter() {}

  getDate(item: any) {
    if (item instanceof firebase.firestore.Timestamp) {
      const tt = item as firebase.firestore.Timestamp;
      return tt.toDate().toISOString();
    }
  }
}
