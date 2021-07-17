import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AutorizadasPage } from './autorizadas.page';
import { AutorizadaItemComponent } from './list-view/autorizada-item.component';
import { AutorizadasListComponent } from './list-view/autorizadas-list.component';
import { SharedFiltersModule } from '@papx/shared/filters/shared-filters.module';

const routes: Routes = [
  {
    path: '',
    component: AutorizadasPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedFiltersModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    AutorizadasPage,
    AutorizadasListComponent,
    AutorizadaItemComponent,
  ],
})
export class AutorizadasPageModule {}
