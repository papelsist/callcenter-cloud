import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  AlertController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { Transporte } from '@papx/models';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, startWith, tap, withLatestFrom } from 'rxjs/operators';
import { TransporteFormComponent } from './trasnporte-form/transporte-form.component';

import isEmpty from 'lodash-es/isEmpty';

@Component({
  selector: 'app-transportes',
  templateUrl: './transportes.page.html',
  styleUrls: ['./transportes.page.scss'],
})
export class TransportesPage implements OnInit {
  filter$ = new BehaviorSubject('');

  transportes$ = this.afs
    .collection<Transporte>('transportes', (ref) => ref.orderBy('nombre'))
    .valueChanges({ idField: 'id' });

  filteredList$ = combineLatest([this.filter$, this.transportes$]).pipe(
    map(([term, items]) =>
      isEmpty(term)
        ? items
        : items.filter((i) =>
            i.nombre.toLowerCase().includes(term.toLowerCase())
          )
    ),
    tap(() => this.stopLoading())
  );

  private lod: any;

  constructor(
    private afs: AngularFirestore,
    private modalCtrl: ModalController,
    private loading: LoadingController,
    private alert: AlertController
  ) {}

  ngOnInit() {}

  async startLoading() {
    this.lod = await this.loading.create({
      animated: true,
      message: 'Cargando transportes',
    });
    this.lod.present();
  }
  async stopLoading() {
    if (this.lod) {
      await this.loading.dismiss();
      this.lod = null;
    }
  }

  onFilter(event: any) {
    this.filter$.next(event.detail.value);
  }

  async addTransporte() {
    const modal = await this.modalCtrl.create({
      component: TransporteFormComponent,
      animated: true,
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      await this.afs.collection('transportes').add(data);
    }
  }

  async onEdit(t: Transporte) {
    const modal = await this.modalCtrl.create({
      component: TransporteFormComponent,
      componentProps: { transporte: t },
      animated: true,
      mode: 'ios',
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      // console.log('Actualizando: ', data);
      await this.afs.collection('transportes').doc(t.id).update(data);
    }
  }

  async delete(t: Transporte) {
    const a = await this.alert.create({
      header: 'Eliminar transporte',
      subHeader: 'Seguro que desea eliminar:',
      message: t.nombre,
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Aceptar',
          role: 'accept',
          handler: () => ({ eliminar: true }),
        },
      ],
    });
    await a.present();
    const { data } = await a.onWillDismiss();
    if (data && data.eliminar) {
      await this.afs.collection('transportes').doc(t.id).delete();
    }
  }
}
