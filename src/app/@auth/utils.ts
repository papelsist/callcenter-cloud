import firebase from 'firebase/app';
import { User } from '../@models/user';

export const mapUser = (credentials: firebase.User): User => {
  const {
    uid,
    displayName,
    email,
    emailVerified,
    isAnonymous,
    phoneNumber,
    photoURL,
    metadata,
  } = credentials;

  return {
    uid,
    displayName: displayName ?? 'ERR DisplayName ',
    email,
    emailVerified,
    isAnonymous,
    phoneNumber,
    photoURL,
    lastSignInTime: metadata.lastSignInTime,
    firebaseUser: credentials,
  };
};
