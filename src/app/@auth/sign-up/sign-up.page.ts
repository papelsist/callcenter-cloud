import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { AlertController, LoadingController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { passwordMatch } from './password-match';

import { AuthService } from '../auth.service';
import { finalize, map } from 'rxjs/operators';

@Component({
  selector: 'papx-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  form = new FormGroup(
    {
      displayName: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(70),
        ],
        updateOn: 'blur',
      }),
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email],
        updateOn: 'blur',
      }),
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern('(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{8,15})$'),
      ]),
      confirmPassword: new FormControl(null, [Validators.required]),
      numeroDeEmpleado: new FormControl('999', [Validators.required]),
    },
    { validators: [passwordMatch], updateOn: 'change' }
  );

  controls: { [key: string]: AbstractControl } = {
    displayName: this.form.get('displayName'),
    email: this.form.get('email'),
    password: this.form.get('password'),
    confirmPassword: this.form.get('confirmPassword'),
    numeroDeEmpleado: this.form.get('numeroDeEmpleado'),
  };

  error$ = new BehaviorSubject(null);
  errorColor = 'warning';
  showPassword = false;

  constructor(
    private authService: AuthService,
    private loadingController: LoadingController,
    private alert: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    // const val = {
    //   email: 'manuelroman0708052@gmail.com',
    //   displayName: 'Manuel Roman',
    //   password: 'admin123',
    //   confirmPassword: 'admin123',
    // };
    // this.form.patchValue(val);
    // this.authService.user$.subscribe((user) =>
    //   console.log('Current user signedIn:', user)
    // );
  }

  get confirm() {
    return this.form.get('confirmPassword');
  }

  async signup() {
    const { email, password, displayName } = this.form.value;

    const loading = await this.loadingController.create({
      cssClass: 'sign-in-loading',
      message: 'Iniciando sesión ...',
      spinner: 'circles',
    });

    await loading.present();

    this.authService
      .getUserByEmail(email)
      .pipe(
        map((user) => {
          if (!user) {
            throw new Error('No existe el empleado: ' + email);
          }
          return user;
        }),
        finalize(async () => loading.dismiss())
      )
      .subscribe(
        () => {
          this.authService
            .createUser(email, password, displayName)
            .then((t) => {
              t.user.updateProfile({ displayName });
              return t.user;
            })
            .then(() => this.authService.singOut())
            .then(() => this.router.navigate(['/', 'login']))
            .catch((err) => this.handelError(err));
        },
        (err) => this.handelError(err)
      );

    // this.authService.createUser(email, password, displayName).subscribe(
    //   (siipapUser) => console.log('SiipapUser: ', siipapUser),
    //   (error) => this.handelError(error)
    // );
  }

  hasEmailError() {
    return this.hasError('email', 'email');
  }

  displayNameError() {
    const ctrl = this.controls['displayName'];
    if (ctrl.pristine) return null;
    if (ctrl.hasError('required'))
      return 'Debe registrar el nombre de usuario desado';
    else if (ctrl.hasError('minlength')) return 'Longitud mínima 8';
    else if (ctrl.hasError('maxlength')) return 'Longitud máxina de 70';
    else return null;
  }

  passwordError() {
    const ctrl = this.controls['password'];
    if (ctrl.pristine) return null;
    if (ctrl.hasError('required')) return 'Digite la contraseña desada';
    else if (ctrl.hasError('pattern'))
      return 'Longitud de 8 a 15 caracteres con por lo menos un número';
    else return null;
  }

  validColor(prop: string) {
    return this.isValid(prop) ? 'primary' : '';
  }

  isValid(prop: string) {
    return this.controls[prop].valid;
  }

  hasError(prop: string, code: string) {
    return this.controls[prop].hasError(code);
  }

  async handelError(err) {
    const a = await this.alert.create({
      message: err.message,
      header: 'Error registrando usuario',
      buttons: ['Aceptar'],
      mode: 'ios',
    });
    await a.present();
  }
}
