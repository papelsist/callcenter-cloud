import { NgModule } from '@angular/core';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { CommonUiCoreModule } from '@papx/common/ui-core';

@NgModule({
  imports: [CommonUiCoreModule, TabsPageRoutingModule],
  declarations: [TabsPage],
})
export class TabsPageModule {}
