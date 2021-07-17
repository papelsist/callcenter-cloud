import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Pedido } from '@papx/models';

@Component({
  selector: 'papx-analytics-pendientes-log-resumen',
  template: ` <h2>Resumen de pendientes</h2> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PendientesLogResumneComponent implements OnInit {
  @Input() porVendedor: { vendedor: string; pendientes: Pedido[] };
  constructor() {}

  ngOnInit() {}
}
