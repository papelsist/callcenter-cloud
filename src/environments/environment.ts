// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'AIzaSyApr87DnHxnrmxF_Pv2gigeSE-err2QHWg',
    authDomain: 'papx-ws-dev.firebaseapp.com',
    projectId: 'papx-ws-dev',
    storageBucket: 'papx-ws-dev.appspot.com',
    messagingSenderId: '245292921623',
    appId: '1:245292921623:web:116c7620999796721cfd52',
  },
  useEmulators: true,
  hostUrl: 'http://localhost:8100/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
