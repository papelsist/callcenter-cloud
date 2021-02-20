import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormGroup, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'papx-pedido-item-validation',
  template: `
    <ng-container *ngIf="errors$ | async as errors">
      <div *ngIf="errors.length > 0">
        <ion-list-header lines="inset">
          <ion-label color="secondary">Validaciones</ion-label>
        </ion-list-header>
        <ion-grid>
          <ion-row *ngFor="let error of errors">
            <ion-col>
              <ion-text color="danger">
                {{ getErrorMessage(error) }}
              </ion-text>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PedidoItemValidationComponent implements OnInit {
  @Input() parent: FormGroup;
  visible$: Observable<boolean>;
  errors$: Observable<any>;
  constructor() {}

  ngOnInit() {
    const form = this.parent;

    this.errors$ = form.valueChanges.pipe(
      map(() => {
        return Object.keys(form.controls)
          .filter((key) => form.get(key).errors)
          .map((key) => {
            return {
              property: key,
              errors: form.get(key).errors,
            };
          });
      })
    );
  }

  getErrorMessage(err: { property: string; errors: ValidationErrors }) {
    switch (err.property) {
      case 'producto':
        if (err.errors.required) {
          return 'Se require seleccionar un  producto';
        }
        break;
      case 'cantidad':
        return 'Digite la cantidad a vender';
      case 'instruccion':
        return 'Para efectuar el corte se requiere definir su instrucción';
      case 'corte':
        return 'Corte invalido: ' + err.errors.message;
      default:
        console.error('Unhandled error validation: ', err);
        return `${err.property} inválida`;
    }
  }
}
