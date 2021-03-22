import firebase from 'firebase/app';

export interface Autorizacion {
  fecha: firebase.firestore.Timestamp;
  createUser: string;
  uid: string;
  comentario?: string;
  replicado?: firebase.firestore.Timestamp;
}

export interface AutorizacionRechazo {
  uid: string;
  userName: string;
  tipo?: string;
  motivo: string;
  comentario?: string;
  dateCreated?: firebase.firestore.Timestamp;
  replicado?: firebase.firestore.Timestamp;
}
