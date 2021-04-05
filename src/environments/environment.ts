// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'AIzaSyCDfKhbG1VApFFMynFVeoxQ9BTRtam72_8',
    authDomain: 'papx-ws-prod.firebaseapp.com',
    projectId: 'papx-ws-prod',
    storageBucket: 'papx-ws-prod.appspot.com',
    messagingSenderId: '279183721577',
    appId: '1:279183721577:web:a1286a3c4d59a686b4cef8',
    measurementId: 'G-C6YBXMS8CL',
  },
  useEmulators: false,
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
