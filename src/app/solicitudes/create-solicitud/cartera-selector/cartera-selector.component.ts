import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Cartera, carteraDisplayName } from '@papx/models';
import { CarterasPopoverComponent } from './carteras-popover.component';

@Component({
  selector: 'papx-cartera-selector',
  template: ` <ion-button
    color="tertiary"
    fill="outline"
    shape="round"
    strong="true"
    [disabled]="disabled"
    (click)="select($event)"
  >
    {{ getName() }}
  </ion-button>`,
})
export class CarteraSelectorComponent implements OnInit {
  @Input() cartera: Cartera;
  @Output() carteraChange = new EventEmitter<Cartera>();
  @Input() disabled = false;
  constructor(private popoverController: PopoverController) {}

  ngOnInit() {}

  getName() {
    return carteraDisplayName(this.cartera);
  }

  async select(ev: any) {
    const pop = await this.popoverController.create({
      component: CarterasPopoverComponent,
      animated: true,
      event: ev,
      mode: 'ios',
    });
    await pop.present();
    const { data } = await pop.onWillDismiss();
    if (data) {
      this.carteraChange.emit(data.cartera);
    }
  }
}
