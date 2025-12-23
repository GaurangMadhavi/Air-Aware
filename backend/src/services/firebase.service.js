const admin = require("firebase-admin");
const path = require("path");

const serviceAccount = require(
  path.join(__dirname, "../../firebase-admin.json")
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

async function sendPushNotification(token, title, body) {
  if (!token) return;

  await admin.messaging().send({
    token,
    notification: { title, body },
    webpush: {
      headers: { Urgency: "high" },
    },
  });
}

module.exports = { sendPushNotification };
