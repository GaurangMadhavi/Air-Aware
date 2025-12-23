const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(to, subject, text) {
  try {
    if (!to || !to.includes("@")) return;

    await sgMail.send({
      to,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL, // VERIFIED EMAIL
        name: "Air Aware Alerts",
      },
      subject,
      text,
    });

    console.log(`✅ Email sent to ${to}`);
  } catch (err) {
    console.error("❌ Email failed:", err.response?.body || err.message);
  }
}

module.exports = { sendEmail };
