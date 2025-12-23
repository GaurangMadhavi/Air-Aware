require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI,
  GOOGLE_SHEETS_URL: process.env.GOOGLE_SHEETS_URL,
  OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY,
  JWT_SECRET: process.env.JWT_SECRET,

  TWILIO: {
    SID: process.env.TWILIO_ACCOUNT_SID,
    TOKEN: process.env.TWILIO_AUTH_TOKEN,
    SMS_FROM: process.env.TWILIO_SMS_FROM,
  },

  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM,
};
