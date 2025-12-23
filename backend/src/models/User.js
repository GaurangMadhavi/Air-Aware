const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      match: [/^\+\d{10,15}$/, "Invalid phone number format"],
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    latitude: {
      type: Number,
      required: true,
    },

    longitude: {
      type: Number,
      required: true,
    },

    aqiThreshold: {
      type: Number,
      default: 150,
    },


    notifySMS: {
      type: Boolean,
      default: true,
    },

    notifyWhatsApp: {
      type: Boolean,
      default: true,
    },

    notifyEmail: {
      type: Boolean,
      default: true,
    },

    lastLocationUpdatedAt: {
      type: Date,
    },
    pushToken: { type: String },

  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
