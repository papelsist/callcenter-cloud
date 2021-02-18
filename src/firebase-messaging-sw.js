importScripts("https://www.gstatic.com/firebasejs/8.2.6/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.6/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyApr87DnHxnrmxF_Pv2gigeSE-err2QHWg",
  authDomain: "papx-ws-dev.firebaseapp.com",
  projectId: "papx-ws-dev",
  storageBucket: "papx-ws-dev.appspot.com",
  messagingSenderId: "245292921623",
  appId: "1:245292921623:web:116c7620999796721cfd52",
});

const messaging = firebase.messaging();
