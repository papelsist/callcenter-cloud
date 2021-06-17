import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { Producto } from '@papx/models';
import { combineLatest, Observable, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
} from 'rxjs/operators';
import { ProductoService } from '../data-access';

@Component({
  selector: 'papx-producto-control',
  template: `
    <mat-form-field class="producto-field" [appearance]="apparence">
      <mat-label>Producto</mat-label>
      <input
        type="text"
        [placeholder]="placeholder"
        matInput
        [matAutocomplete]="auto"
        [formControl]="control"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
      />
      <mat-icon matSuffix>layers</mat-icon>
    </mat-form-field>
    <mat-autocomplete
      #auto="matAutocomplete"
      autoActiveFirstOption
      [disableRipple]="false"
      [displayWith]="displayFn"
      (optionSelected)="onSelection($event.option.value)"
    >
      <mat-option *ngFor="let prod of filteredProducts$ | async" [value]="prod">
        <div class="cliente-panel">
          <span class="clave">
            {{ prod.clave }}
          </span>
          <span class="descripcion">
            {{ prod.descripcion }} ({{ prod.modoVenta }})
          </span>
        </div>
      </mat-option>
    </mat-autocomplete>
  `,
  styleUrls: ['./producto-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ProductoControlComponent,
      multi: true,
    },
  ],
})
export class ProductoControlComponent implements OnInit, ControlValueAccessor {
  @Input() placeholder = 'Buscar producto';
  @Input() apparence: 'legacy' | 'standard' | 'fill' | 'outline' = 'outline';
  control = new FormControl();
  selected: any;
  onChange: any = () => {};
  onTouch: any = () => {};
  filteredProducts$: Observable<Producto[]>;
  productos$: Observable<Producto[]>;
  @Output() selection = new EventEmitter();
  _producto: Partial<Producto>;
  constructor(private service: ProductoService) {}

  ngOnInit() {
    this.productos$ = this.service.productos$;
    const filter$ = this.control.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      filter((value) => typeof value === 'string')
    );
    this.filteredProducts$ = combineLatest([filter$, this.productos$]).pipe(
      map(([term, items]) => {
        const sterm = (term as string).toLowerCase();
        return items.filter((item) => {
          const pattern = `${item.descripcion}+${item.clave}`;
          return pattern.toLowerCase().includes(sterm);
        });
      })
    );
  }

  @Input()
  set producto(value: Partial<Producto>) {
    this._producto = value;
    this.control.setValue(this._producto);
  }
  get producto() {
    return this.control.value;
  }

  writeValue(obj: any): void {
    this.control.setValue(obj);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.control.disable() : this.control.enable();
  }

  onSelection(event: any) {
    this.selected = event;
    this.onChange(event);
    this.onTouch(event);
    this.selection.emit(event);
  }

  displayFn(producto?: Partial<Producto>): string | undefined {
    return producto ? `${producto.clave} ${producto.descripcion}` : undefined;
  }
}
