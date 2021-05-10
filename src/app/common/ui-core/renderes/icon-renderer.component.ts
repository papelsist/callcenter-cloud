import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'papx-icon-renderer',
  template: `
    <ion-icon
      (click)="onClick($event)"
      [color]="params.color"
      [name]="params.name"
    ></ion-icon>
  `,
  styles: [
    `
      ion-icon {
        cursor: pointer;
        border-radius: 30%;
        width: 60%;
        height: 80%;
        padding: 1px;
      }
      ion-icon:hover {
        color: var(--ion-color-medium-contrast);
      }
    `,
  ],
})
export class IconRendererComponent {
  params: any;
  constructor() {}

  // gets called once before the renderer is used
  agInit(params: any): void {
    this.params = params;
    // console.log('Params: ', params);
  }

  // gets called whenever the cell refreshes
  refresh(params: ICellRendererParams): boolean {
    return false;
  }

  onClick(event: Event) {
    event.stopPropagation();
    this.params.callback(event, this.params.data);
  }
}
