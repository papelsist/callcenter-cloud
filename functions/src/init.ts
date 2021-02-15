/*  Firebase admin SDK inicialization module
 * used to share the admin services among all functions
 */

import * as admin from 'firebase-admin';

let hasInit = false;
/**
 * Initialize firebase admin SDK in orther to be used by any
 * firebase function
 */
export function initSdk(): void {
  if (!hasInit) {
    admin.initializeApp();
    hasInit = true;
  }
}

let _db: admin.firestore.Firestore;

/**
 * Returns firestore initilized database
 * @return {Firestore} The sum of the two numbers.
 */
export function getFirestore(): admin.firestore.Firestore {
  initSdk();
  return _db ?? (_db = admin.firestore());
}

/**
 * Returns the initialized admin SDK
 * @return {admin}
 */
export function getAdmin() {
  initSdk();
  return admin;
}
