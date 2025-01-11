const mongoose = require("mongoose");

const SupportMessageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  sender: { type: String, required: true }, // Can be "admin" or the user's ID
  name: { type: String, default: null }, // Can be "admin" or the user's ID
  message: { type: String, default: null },
  fileName: { type: String, default: null },
  filePath: { type: String, default: null },
  timestamp: { type: Date, default: Date.now },
  isUnread: { type: Boolean, default: true }, // Track unread messages
});

module.exports = mongoose.model("SupportMessage", SupportMessageSchema);
