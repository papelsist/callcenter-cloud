import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireFunctions } from '@angular/fire/functions';

import { throwError, of, Observable } from 'rxjs';
import {
  catchError,
  map,
  pluck,
  shareReplay,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';

import { AngularFirestore } from '@angular/fire/firestore';

import { environment } from '@papx/environment/environment';
import { User, UserInfo } from '../@models/user';
import { mapUser } from './utils';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly hostUrl = environment.hostUrl;

  readonly user$ = this.auth.user.pipe(
    map((user) => (user ? mapUser(user) : null)),
    take(1),
    shareReplay()
  );

  readonly claims$ = this.auth.idTokenResult.pipe(
    map((res) => (res ? res.claims : {}))
  );

  readonly userInfo$: Observable<UserInfo | null> = this.user$.pipe(
    switchMap((user) => {
      return user ? this.getUserByEmail(user.email) : of(null);
    }),

    catchError((err) => throwError(err))
  );

  constructor(
    private readonly auth: AngularFireAuth,
    private readonly fns: AngularFireFunctions,
    private readonly firestore: AngularFirestore
  ) {}

  async singOut() {
    await this.auth.signOut();
  }

  async signInAnonymously() {
    const { user } = await this.auth.signInAnonymously();
    return mapUser(user);
  }

  async signIn(email: string, password: string) {
    try {
      const { user } = await this.auth.signInWithEmailAndPassword(
        email,
        password
      );
      return user;
    } catch (error) {
      /*
      let message = null;
      switch (error.code) {
        case 'auth/user-not-found':
          message = 'Usuario no registrado';
          break;
        case 'auth/wrong-password':
          message = 'Nombre de corrreo ó contraseña incorrectas';
          break;
        default:
          message = error.message;
          break;
      }
      */
      throw new Error('Credenciales incorrectas');
    }
  }

  async createUser(email: string, password: string, displayName: string) {
    const credentials = await this.auth.createUserWithEmailAndPassword(
      email,
      password
    );
    return credentials;
    // return credentials;

    /*
    await credentials.user.sendEmailVerification({
      url: this.hostUrl,
      handleCodeInApp: false,
    });
    */
    // return credentials;
  }

  sendEmailVerification(user: User) {
    const url = `https://${location.host}/home`;
    console.log('Sending verification email return url: ', url);
    return user.firebaseUser.sendEmailVerification({
      url: url,
      handleCodeInApp: false,
    });
  }

  createSiipapUser(email: string, password: string, displayName: string) {
    const data = { email, password, displayName };
    const callable = this.fns.httpsCallable('createSiipapUser');
    return callable(data).pipe(
      map(() => this.auth.signInWithEmailAndPassword(email, password)),
      /*
      map(async (p) => {
        const d = await p;
        const user = d.user;
        await user.sendEmailVerification({
          url: this.hostUrl,
          handleCodeInApp: false,
        });
        return user;
      }),
      */
      catchError((err) => throwError(err))
    );
  }

  getUserByUid(uid: string): Observable<UserInfo | null> {
    return this.firestore
      .collection<UserInfo>('usuarios', (ref) => {
        return ref.where('uid', '==', uid).limit(1);
      })
      .valueChanges()
      .pipe(
        map((users) => (users.length > 0 ? users[0] : null)),
        catchError((err) => throwError(err))
      );
  }

  getUserByEmail(email: string): Observable<UserInfo | null> {
    return this.firestore
      .collection<UserInfo>('usuarios', (ref) => {
        return ref.where('email', '==', email).limit(1);
      })
      .valueChanges()
      .pipe(
        take(1),
        map((users) => (users.length > 0 ? users[0] : null)),
        catchError((err) => throwError(err))
      );
  }

  async updateSucursal(user: UserInfo, sucursal: string) {
    await this.firestore
      .collection('usuarios')
      .doc(user.uid)
      .update({ sucursal });
  }
}
