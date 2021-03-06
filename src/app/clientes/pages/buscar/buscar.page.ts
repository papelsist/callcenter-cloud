import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import {
  AlertController,
  IonSearchbar,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { AuthService } from '@papx/auth';
import { Cliente, User } from '@papx/models';
import { ClientesFacade } from '@papx/shared/clientes/@data-access/+state/clientes.facade';
import { ClientesDataService } from '@papx/shared/clientes/@data-access/clientes-data.service';
import { ClienteFormComponent } from '@papx/shared/clientes/cliente-form/cliente-form.component';

import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.page.html',
  styleUrls: ['./buscar.page.scss'],
})
export class BuscarPage implements OnInit, AfterViewInit {
  clientes$ = this.facade.clientes$;
  user$ = this.auth.userInfo$;
  @ViewChild(IonSearchbar) searchbar: IonSearchbar;

  constructor(
    private service: ClientesDataService,
    private facade: ClientesFacade,
    private modalController: ModalController,
    private alert: AlertController,
    private loading: LoadingController,
    private auth: AuthService
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    setTimeout(async () => await this.searchbar.setFocus(), 600);
  }

  onSearch(event: string) {
    this.service
      .searchClientes(event, 1)
      .pipe(
        tap((data) => this.facade.setClientes(data)),
        take(1)
      )
      .subscribe(() => {});
  }

  ionViewDidEnter() {}

  ionViewDidLeave() {}

  async onCreate(user: User) {
    const modal = await this.modalController.create({
      component: ClienteFormComponent,
      componentProps: {},
      cssClass: 'cliente-form-modal',
      animated: true,
      mode: 'ios',
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (data) {
      try {
        await this.starLoading();
        const id = await this.service.saveCliente(data, user);
        await this.stopLoading();
        console.log('Cliente generado id: ', id);
      } catch (error) {
        await this.stopLoading();
        this.handelError(error);
      }
    }
  }

  async onEdit(cliente: Cliente) {}

  async handelError(error: any) {
    const al = await this.alert.create({
      header: 'Error al salvar cliente',
      message: error.message || 'Sin información',
      cssClass: 'cliene-persist-alert',
      mode: 'ios',
      translucent: true,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
      ],
    });
    await al.present();
  }

  async starLoading(message = 'Procesando') {
    const l = await this.loading.create({
      message,
      mode: 'ios',
      spinner: 'circles',
      translucent: true,
      backdropDismiss: false,
      id: 'cliente-loading',
    });
    await l.present();
  }

  async stopLoading() {
    await this.loading.dismiss(null, null, 'cliente-loading');
  }
}
