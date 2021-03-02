import { Component, OnInit } from '@angular/core';
import { AuthService } from '@papx/auth';
import { ClientesDataService } from '@papx/shared/clientes/@data-access/clientes-data.service';
import { combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage implements OnInit {
  user$ = this.auth.user$;
  favoritos$ = this.user$.pipe(
    switchMap((user) => this.clienteDataService.fetchFavoritos(user))
  );
  vm$ = combineLatest([this.auth.user$]).pipe(map(([user]) => ({ user })));

  constructor(
    private auth: AuthService,
    private clienteDataService: ClientesDataService
  ) {}

  ngOnInit() {}
}
