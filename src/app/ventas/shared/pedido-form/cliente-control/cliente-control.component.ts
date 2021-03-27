import {
  Component,
  OnInit,
  Input,
  forwardRef,
  ChangeDetectorRef,
} from '@angular/core';

import { Observable } from 'rxjs';
import {
  distinctUntilChanged,
  debounceTime,
  switchMap,
  map,
} from 'rxjs/operators';

import {
  FormControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

import includes from 'lodash-es/includes';
import filter from 'lodash-es/filter';

import { ClientesDataService } from '@papx/shared/clientes/@data-access/clientes-data.service';

@Component({
  selector: 'papx-cliente-control',
  templateUrl: './cliente-control.component.html',
  styleUrls: ['./cliente-control.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ClienteControlComponent),
      multi: true,
    },
  ],
})
export class ClienteControlComponent implements OnInit, ControlValueAccessor {
  @Input() placeholder = 'Seleccione el cliente';
  @Input() apparence: 'legacy' | 'standard' | 'fill' | 'outline' = 'fill';

  control = new FormControl();

  selected: any;

  filteredClientes$: Observable<any>;

  onChange: any = () => {};
  onTouch: any = () => {};
  constructor(
    private service: ClientesDataService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.filteredClientes$ = this.control.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      // filter((value) => typeof value === 'string'),
      switchMap((value) => this.lookUp(value))
    );
  }

  lookUp(value: string) {
    return this.service.clientesCache$.pipe(
      map((rows) =>
        filter(rows, (item) =>
          includes(item.nombre.toLowerCase(), value.toLowerCase())
        )
      )
    );
  }

  displayFn(cliente?: any): string | undefined {
    return cliente ? `${cliente.nombre} (${cliente.rfc})` : undefined;
  }

  onSelection(event: any) {
    this.selected = event;
    this.onChange(event);
    this.onTouch(event);
  }

  isDeCredito() {
    return this.selected ? this.selected.credito : false;
  }

  /*** ControlValueAccessor implementation ***/

  writeValue(obj: any): void {
    this.control.setValue(obj);
    this.cd.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.control.disable() : this.control.enable();
    this.cd.markForCheck();
  }

  /*** END ControlValueAccessor implementation ***/
}
