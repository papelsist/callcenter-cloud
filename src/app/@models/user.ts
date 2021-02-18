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

export interface UserInfo extends User {
  nombre: string;
  numeroDeEmpleado: number;
  puesto: string;
  roles: string[];
  sucursal: string;
}

export interface UsuarioDto {
  uid: string;
  displayName: string;
  email: string;
}
