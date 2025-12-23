const twilio = require("twilio");
const { TWILIO } = require("../config/env");

const client = twilio(TWILIO.SID, TWILIO.TOKEN);

/* 📩 SMS */
async function sendSMS(phone, message) {
  try {
    await client.messages.create({
      from: TWILIO.SMS_FROM,
      to: phone,
      body: message,
    });
    console.log(`✅ SMS sent to ${phone}`);
  } catch (err) {
    console.error("❌ SMS failed:", err.message);
  }
}

/* 💬 WhatsApp (Sandbox) */
async function sendWhatsApp(phone, message) {
  try {
    await client.messages.create({
      from: "whatsapp:+14155238886", // Twilio Sandbox
      to: `whatsapp:${phone}`,
      body: message,
    });
    console.log(`✅ WhatsApp sent to ${phone}`);
  } catch (err) {
    console.error("❌ WhatsApp failed:", err.message);
  }
}

module.exports = { sendSMS, sendWhatsApp };
