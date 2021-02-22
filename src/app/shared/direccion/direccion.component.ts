import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'sxcc-direccion',
  template: `
    <address>
      <p>Paseo del potrero 109</p>
      <p>Pedregal del Gigante</p>
      <p>León, Guanajuato</p>
      <p>CP: 37296</p>
    </address>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DireccionComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
