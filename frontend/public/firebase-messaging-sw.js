importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyC6Rll0SlZlUeLQj8dNYjJqPUKL_ciphYg",
  authDomain: "air-aware-67945.firebaseapp.com",
  projectId: "air-aware-67945",
  storageBucket: "air-aware-67945.firebasestorage.app",
  messagingSenderId: "670877396026",
  appId: "1:670877396026:web:410548474aef4335df5903",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo.png",
    vibrate: [200, 100, 200],
    sound: "/alert.mp3",
  });
});
