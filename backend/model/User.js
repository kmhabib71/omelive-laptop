const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    name: {
      type: String,
    },
    userLanguage: {
      type: String,
    },
    userGender: {
      type: String,
    },
    userAge: {
      type: Number,
    },
    userInterests: {
      type: [String],
      default: [],
    },
    userCountry: {
      type: String,
    },
    socketID: {
      type: String,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    filters: {
      gender: {
        type: String,
        enum: ["male", "female", "other"],
        default: "other",
      },
      ageRange: {
        min: { type: Number, default: 18 },
        max: { type: Number, default: 100 },
      },
      location: { type: String, default: "" },
      interests: { type: [String], default: [] },
    },
    connectionAttempts: {
      dailyAttempts: { type: Number, default: 0 },
      lastAttemptDate: { type: Date, default: Date.now },
    },
    chatTimeLimit: {
      type: Number,
      default: 30, // Default for free users, unlimited for premium users handled in application logic
    },
    virtualGifts: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Gift",
      default: [],
    },
    chatHistory: [
      {
        endedAt: { type: Date, default: Date.now },
      },
    ],
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    amountBalance: {
      type: Number,
      default: 0,
    },
    connectionHistory: [
      {
        connectedUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        connectedAt: { type: Date, default: Date.now },
      },
    ],
  },

  {
    timestamps: true, // Fixed the typo from `timeseries` to `timestamps`
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
