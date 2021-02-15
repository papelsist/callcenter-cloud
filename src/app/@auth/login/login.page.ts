import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth.service';
import { LoadingController } from '@ionic/angular';
import { BaseComponent } from 'src/app/core';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage extends BaseComponent implements OnInit {
  form: FormGroup = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl(null, { validators: [Validators.required] }),
  });
  error$ = new BehaviorSubject(null);
  readonly loading$ = new BehaviorSubject(false);

  constructor(
    private service: AuthService,
    private router: Router,
    private loadingController: LoadingController
  ) {
    super();
  }

  ngOnInit() {
    this.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((l) => (l ? this.form.disable() : this.form.enable()));
  }

  login() {
    this.loading$.next(true);
    setTimeout(async () => {
      const { email, password } = this.form.value;
      try {
        const user = await this.service.signIn(email, password);
        this.router.navigate(['/']);
      } catch (error) {
        this.error$.next(error.message);
      } finally {
        this.loading$.next(false);
      }
    }, 1000);
  }

  async startLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'sign-in-loading',
      message: 'Iniciando sesión ...',
      spinner: 'circles',
    });
    loading.present();
  }

  async stopLoading() {
    console.log('Stop loading...');
    this.loadingController.dismiss();
  }

  hasEmailError() {
    const c = this.form.get('email');
    return c.hasError('required')
      ? 'Digite su cuenta de correo'
      : c.hasError('email')
      ? 'La cuenta de usuario debes ser un correo válido'
      : null;
  }

  hasPasswordError() {
    const c = this.form.get('password');
    if (c.pristine) return null;
    return c.hasError('required') ? 'Digite su contraseña' : null;
  }

  doEnter(event) {
    if (this.form.valid) {
      this.login();
    }
  }
}
