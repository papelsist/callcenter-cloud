import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnInit,
} from '@angular/core';
import { filter, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Directive({
  selector: '[papxHasRole]',
})
export class HasRoleDirective implements OnInit {
  @Input('papxHasRole') papxHasRole: string;

  claims: any;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.claims$
      .pipe(
        tap((claims) => {
          console.log('Evaluando claims: ', claims);
          console.log('Has role: ', this.papxHasRole);
          console.log('Bang: ', !claims[this.papxHasRole]);
          console.log('!!Bang: ', !claims[this.papxHasRole]);
        }),
        tap(() => this.viewContainer.clear()),
        filter((claims) => !claims[this.papxHasRole]),
        tap((found) => console.log('Found: ', found)),
        take(1)
      )
      .subscribe((claims) => {
        this.viewContainer.createEmbeddedView(this.templateRef);
      });
  }
}
