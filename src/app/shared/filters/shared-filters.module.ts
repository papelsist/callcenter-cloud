import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SolicitudesFilterComponent } from './solicitudes-filter/solicitudes-filter.component';
import { SolicitudesFilterModalComponent } from './solicitudes-filter/solicitudes-filter-modal.component';
import { PeriodoSelectorComponent } from './periodo-selector/periodo-selector.component';
import { PeriodoSelectorBtnComponent } from './periodo-selector/periodo-selector-btn.component';

@NgModule({
  imports: [FormsModule, ReactiveFormsModule, IonicModule],
  declarations: [
    SolicitudesFilterComponent,
    SolicitudesFilterModalComponent,
    PeriodoSelectorComponent,
    PeriodoSelectorBtnComponent,
  ],
  exports: [
    SolicitudesFilterComponent,
    PeriodoSelectorComponent,
    PeriodoSelectorBtnComponent,
  ],
  providers: [],
})
export class SharedFiltersModule {}
