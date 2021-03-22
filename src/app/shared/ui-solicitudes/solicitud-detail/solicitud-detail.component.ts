import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { SolicitudDeDeposito } from '@papx/models';

@Component({
  selector: 'papx-solicitud-detail',
  templateUrl: './solicitud-detail.component.html',
  styleUrls: ['./solicitud-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudDetailComponent implements OnInit {
  @Input() solicitud: SolicitudDeDeposito;
  retrasoColor = 'warning';
  retraso = '1 hora';
  constructor() {}

  ngOnInit() {}
}
