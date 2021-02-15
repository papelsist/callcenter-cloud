import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  AngularFireAuthGuard,
  hasCustomClaim,
  emailVerified,
  redirectUnauthorizedTo,
  redirectLoggedInTo,
  canActivate,
  loggedIn,
  AuthPipe,
} from '@angular/fire/auth-guard';

export const redirectVerifiedTo: (redirect: string | any[]) => AuthPipe = (
  redirect
) =>
  pipe(
    emailVerified,
    map((verified) => {
      return !verified || redirect;
    })
  );

export const redirectUnverifiedTo: (redirect: string | any[]) => AuthPipe = (
  redirect
) =>
  pipe(
    emailVerified,
    map((verified) => verified || redirect)
  );

export const redirectUnauthorized = () => redirectUnauthorizedTo(['login']);

export const redirectLoggedInToHome = () => redirectLoggedInTo(['home']);

export const redirectVeifiedToHome = () => redirectVerifiedTo('home');

export const redirectUnverifiedToPending = () =>
  redirectUnverifiedTo('pending');
