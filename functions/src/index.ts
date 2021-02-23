import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { initSdk, getFirestore } from './init';
import { addPedido } from './pedidos';

initSdk(); // Init Firebase SDK
const firestore = getFirestore();

export const createSiipapUser = functions.https.onCall(
  async (data, context) => {
    functions.logger.info('Registrando un nuevo usuario: ', data);
    const { email, password, displayName } = data;
    try {
      // Validar que exista el usuario de siipap registrado
      const usersRef = firestore.collection('usuarios');
      const snapshot = await usersRef
        .where('email', '==', email)
        .limit(1)
        .get();
      if (snapshot.empty) {
        return new Promise((resolve, reject) => {
          reject(
            new functions.https.HttpsError(
              'not-found',
              `No existe empleado registrado con el email: ${email}`
            )
          );
        });
      }
      const uid = snapshot.docs[0].id;
      const { telefono } = snapshot.docs[0].data();

      const user = await admin.auth().createUser({
        email,
        password,
        emailVerified: false,
        displayName,
        disabled: false,
        uid,
      });
      if (telefono) user.phoneNumber = telefono;

      return user;
    } catch (error) {
      const code = error.code;
      let message = error.message;
      if (code === 'auth/email-already-exists') {
        message = 'Email ya registrado por otro usuario';
      }
      functions.logger.error(error.code, message);
      return new Promise((resolve, reject) => {
        reject(new functions.https.HttpsError('already-exists', message));
      });
    }
  }
);

export const onCreateUser = functions.auth.user().onCreate(async (user) => {
  functions.logger.info('User created: ' + user.displayName);

  const usersRef = firestore.collection('users');
  const snapshot = await usersRef
    .where('email', '==', user.email)
    .limit(1)
    .get();
  if (!snapshot.empty) {
    const data = snapshot.docs[0].data();
    if (data) {
      const roles: string[] = data.roles || [];
      const croles = roles.map((item) => item.substr(5));
      const claims = croles.reduce((prev, curr) => {
        return { ...prev, [curr]: true };
      }, {});
      return admin.auth().setCustomUserClaims(user.uid, claims);
    }
  }
  return null;
});

// exports.createSiipapUser = createSiipapUser;
exports.addPedido = addPedido;
