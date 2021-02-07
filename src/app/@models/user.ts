import firebase from 'firebase/app';

export interface User {
  uid: string;
  displayName: string;
  isAnonymous: boolean;
  phoneNumber?: string;
  photoURL?: string;
  email: string | null;
  emailVerified: boolean;
  lastSignInTime: string;
  firebaseUser: firebase.User;
}
