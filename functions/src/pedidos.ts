import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { getFirestore } from './init';
import { getFolio } from './folios';

const firestore = getFirestore();

export const addPedido = functions.https.onCall(async (data, context) => {
  functions.logger.info('Registrando un pedido nuevo: ', data);
  try {
    firestore.runTransaction(async (transaction) => {
      const command = {
        sucursal: 'CALLCENTER',
        transaction,
        db: firestore,
        entidad: 'pedidos',
      };
      const folio = await getFolio(command);
      const FieldValue = admin.firestore.FieldValue;
      const payload = {
        ...data,
        folio,
        createLog: {
          uid: context.auth?.uid,
          email: context.auth?.token.email,
          time: FieldValue.serverTimestamp(),
        },
      };
      const docRef = firestore.collection('pedidos').doc();
      transaction.create(docRef, payload);
      return docRef.get();
    });
  } catch (error) {
    const message = error.message;
    functions.logger.error(error.code, message);
    return new Promise((resolve, reject) => {
      reject(new functions.https.HttpsError('internal', message));
    });
  }
});
