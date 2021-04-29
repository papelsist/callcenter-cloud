import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';

import { throwError, of, Observable } from 'rxjs';
import {
  catchError,
  map,
  pluck,
  shareReplay,
  switchMap,
  take,
} from 'rxjs/operators';

import { AngularFirestore } from '@angular/fire/firestore';
import { User, UserInfo } from '../@models/user';
import { mapUser } from './utils';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly user$ = this.auth.authState.pipe(
    map((user) => (user ? mapUser(user) : null))
  );

  readonly claims$ = this.auth.idTokenResult.pipe(
    map((res) => (res ? res.claims : {}))
  );

  readonly userInfo$: Observable<UserInfo | null> = this.user$.pipe(
    switchMap((user) => (user ? this.getUser(user.uid) : of(null))),
    catchError((err) => throwError(err))
  );

  readonly sucursal$ = this.userInfo$.pipe(pluck('sucursal'), shareReplay(1));

  constructor(
    private readonly auth: AngularFireAuth,
    private readonly firestore: AngularFirestore
  ) {}

  async singOut() {
    await this.auth.signOut();
  }

  async signIn(email: string, password: string) {
    try {
      const { user } = await this.auth.signInWithEmailAndPassword(
        email,
        password
      );
      return user;
    } catch (error) {
      console.error('EX: ', error);
      throw new Error('Credenciales incorrectas');
    }
  }

  sendEmailVerification(user: User) {
    return user.firebaseUser.sendEmailVerification({
      url: location.origin,
      handleCodeInApp: false,
    });
  }

  updateProfile(profile: { displayName: string }) {
    return this.user$.pipe(
      take(1),
      switchMap(async (user) => {
        await user.firebaseUser.updateProfile(profile);
        return user;
      }),
      switchMap(
        async (user) => await this.updateProfileInUsers(user.uid, profile)
      )
    );
  }

  getUser(uid: string) {
    return this.firestore.doc<UserInfo>(`usuarios/${uid}`).valueChanges();
  }

  getUserByUid(uid: string): Observable<UserInfo> {
    return this.firestore
      .collection<UserInfo>('usuarios')
      .doc(uid)
      .valueChanges({ idField: 'uid' });
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

  async updateProfileInUsers(uid: string, profile: any) {
    await this.firestore.collection('usuarios').doc(uid).update(profile);
  }
}
