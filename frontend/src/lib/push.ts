import { messaging } from "./firebase";
import { getToken, onMessage } from "firebase/messaging";

export async function enablePushNotifications() {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return null;

  const token = await getToken(messaging, {
    vapidKey: "BBXydvOHeD-b3vzEVi6zu2f7v5fN4xSh5XhpX7_SdV4zCIULNe_qN0KUM50zWqb-Lal3j9qK1J-OPGX0cudy-GQ",
  });

  return token;
}

export function onForegroundMessage(cb: (payload: any) => void) {
  onMessage(messaging, cb);
}
