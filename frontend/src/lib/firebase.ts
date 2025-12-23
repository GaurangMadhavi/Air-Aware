import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyC6Rll0SlZlUeLQj8dNYjJqPUKL_ciphYg",
  authDomain: "air-aware-67945.firebaseapp.com",
  projectId: "air-aware-67945",
  storageBucket: "air-aware-67945.firebasestorage.app",
  messagingSenderId: "670877396026",
  appId: "1:670877396026:web:410548474aef4335df5903",
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const requestFCMToken = async () => {
  // 🔔 EXPLICIT permission request
  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    console.warn("❌ Notification permission not granted");
    return null;
  }

  const token = await getToken(messaging, {
    vapidKey:
      "BBXydvOHeD-b3vzEVi6zu2f7v5fN4xSh5XhpX7_SdV4zCIULNe_qN0KUM50zWqb-Lal3j9qK1J-OPGX0cudy-GQ",
  });

  console.log("✅ FCM Token:", token);
  return token;
};

export const onForegroundMessage = (cb: any) =>
  onMessage(messaging, cb);
