import { Component } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { ClientesDataService } from '@papx/shared/clientes/@data-access/clientes-data.service';
import { AuthService } from '../@auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  title = 'Callcenter App';
  user$ = this.auth.userInfo$;
  host = location.href;
  constructor(
    private auth: AuthService,
    private clienteService: ClientesDataService
  ) {}

  ionViewDidEnter() {
    console.log('Did enter.... ');
    this.clienteService.clientesCache$.subscribe((ctes) =>
      console.log('Clientes cargados: ', ctes[0])
    );
  }
}
