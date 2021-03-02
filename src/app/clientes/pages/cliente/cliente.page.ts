import { Component, OnInit } from '@angular/core';
import { AuthService } from '@papx/auth';
import {
  Cliente,
  buildDireccionKey,
  ClienteDireccion,
  User,
} from '@papx/models';

import { combineLatest, Observable, Subject } from 'rxjs';
import { map, switchMap, take, takeUntil, tap } from 'rxjs/operators';

import { ClientesFacade } from '@papx/shared/clientes/@data-access/+state/clientes.facade';
import { ClientesDataService } from '@papx/shared/clientes/@data-access/clientes-data.service';
import { DireccionController } from '@papx/shared/direccion';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.page.html',
  styleUrls: ['./cliente.page.scss'],
})
export class ClientePage implements OnInit {
  destroy$ = new Subject<boolean>();
  cliente$: Observable<Cliente>;
  user$ = this.auth.userInfo$;
  favoritos$: Observable<any[]>;
  isFavorito$: Observable<boolean>;

  constructor(
    private facade: ClientesFacade,
    private direccionController: DireccionController,
    private service: ClientesDataService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.facade.currentId$.pipe(take(1)).subscribe((id) => {
      this.cliente$ = this.service
        .fetchLiveCliente(id)
        .pipe(takeUntil(this.destroy$));
    });

    this.favoritos$ = this.user$.pipe(
      switchMap((user) => this.service.fetchFavoritos(user)),
      tap((favs) => {}),
      takeUntil(this.destroy$)
    );

    this.isFavorito$ = combineLatest([this.cliente$, this.favoritos$]).pipe(
      map(
        ([c, favoritos]) => !!favoritos.find((item) => item.clienteId === c.id)
      )
    );

    // this.isFavorito$.subscribe((f) => console.log('Is favorito: ', f));
  }

  ionViewWillLeave() {
    if (this.destroy$) {
      this.destroy$.next(true);
      this.destroy$.complete();
    }
  }

  async addDireccion(cte: Cliente, user: User) {
    await this.direccionController.addDireccionEntrega(cte, user);
  }

  async editDireccion(cte: Cliente, cteDir: ClienteDireccion, user: User) {
    await this.direccionController.editDireccionEntrega(cte, cteDir, user);
  }

  async deleteDireccion(cte: Cliente, cteDir: ClienteDireccion, user: User) {
    this.direccionController.deleteDireccion(cte, cteDir, user);
  }

  async addTelefono(cte: Cliente, tel: string, user: User) {
    try {
      const telefonos = [...(cte.telefonos || []), tel];
      const data = {
        telefonos,
        updateLog: 'TELEFONO AGREGADO',
      };
      await this.service.updateCliente(cte.id, data, user);
    } catch (error) {
      console.error('Error agregando direccion: ', error.message);
    }
  }

  async updateTelefono(cte: Cliente, idex: number, tel: string, user: User) {
    try {
      const telefonos = [...cte.telefonos].splice(idex, 1, tel);
      const data = {
        telefonos,
        updateLog: 'TELEFONO MODIFICADO',
      };
      await this.service.updateCliente(cte.id, data, user);
    } catch (error) {
      console.error('Error agregando direccion: ', error.message);
    }
  }

  async deletTelefono(cte: Cliente, idx: number, user: User) {
    try {
      const telefonos = [...cte.telefonos].splice(idx, 1);
      const data = {
        telefonos,
        updateLog: 'TELEFONO ELIMINADO',
      };
      await this.service.updateCliente(cte.id, data, user);
    } catch (error) {
      console.error('Error al eliminar  telefono: ', error.message);
    }
  }

  async toggleFavorito(isFavorito: boolean, cte: Cliente, user: User) {
    isFavorito
      ? this.service.removeFromFavoritos(cte.id, user)
      : this.service.addToFavoritos(cte, user);
  }

  async addToFavoritos(cte: Cliente, user: User) {
    this.service.addToFavoritos(cte, user);
  }
}
