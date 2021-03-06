import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ViewChild,
} from '@angular/core';

import { IonSearchbar, ModalController } from '@ionic/angular';

import { BehaviorSubject, of } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

import { Socio } from '@papx/models';
import { ClientesDataService } from '@papx/shared/clientes/@data-access/clientes-data.service';

@Component({
  selector: 'papx-socio-selector',
  template: `
    <ion-header translucent="true">
      <ion-toolbar>
        <ion-title> Socios de la union </ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="close()">
            <ion-label>Cerrar</ion-label>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list-header>
        <ion-searchbar
          #search
          showCancelButton="never"
          placeholder="Buscar socio "
          color="tertiary"
          (ionChange)="onSearch($event)"
          (ionCancel)="close()"
          (keyup.enter)="onEnter(search.value)"
          inputmode="search"
          enterkeyhint="search"
          debounce="400"
          tabindex="0"
          class="ion-text-uppercase"
        ></ion-searchbar>
      </ion-list-header>
      <ion-list lines="full">
        <ion-item
          *ngFor="let c of filtered$ | async"
          (click)="select(c)"
          button
        >
          <ion-label class="ion-text-wrap">
            <ion-text> {{ c.nombre }} ({{ c.clave }}) </ion-text>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocioSelectorComponent implements AfterViewInit {
  filter$ = new BehaviorSubject<string>('');
  socios$ = this.service.socios$;
  filtered$ = this.filter$.pipe(
    withLatestFrom(this.socios$),
    map(([term, socios]) => {
      return term.length <= 0
        ? []
        : socios.filter((item) =>
            item.nombre.toUpperCase().includes(term.toUpperCase())
          );
    })
  );

  @ViewChild(IonSearchbar) searchBar: IonSearchbar;

  constructor(
    private service: ClientesDataService,
    private modalCtrl: ModalController
  ) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.searchBar.setFocus();
    }, 600);
  }

  close() {
    this.modalCtrl.dismiss(null, null, 'socio-selector-modal');
  }
  select(c: Partial<Socio>) {
    this.modalCtrl.dismiss(c);
  }

  onSearch({ target: { value } }: any) {
    this.filter$.next(value);
  }

  onEnter(event: any) {
    this.filter$.next(event);
  }

  handleError(err: any) {
    console.error('Error buscando clientes, ', err);
    return of([]);
  }
}
