const express = require("express");
const router = express.Router();
const SupportMessage = require("../model/SupportMessage"); // Your MongoDB model

// Route to fetch chat history
router.get("/history/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const chatHistory = await SupportMessage.find({ userId }).sort({ timestamp: 1 }); // Sort by timestamp
    res.status(200).json(chatHistory);
  } catch (err) {
    console.error("Error fetching chat history:", err);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
});

// Fetch all distinct conversations
router.get("/conversations", async (req, res) => {
  try {
    const conversations = await SupportMessage.aggregate([
      { $group: { _id: "$userId", lastMessage: { $last: "$$ROOT" } } },
      { $sort: { "lastMessage.timestamp": -1 } }, // Sort by the latest message
    ]);
    res.status(200).json(conversations);
  } catch (err) {
    console.error("Error fetching conversations:", err);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});

// Fetch all messages for a specific user
router.get("/messages/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const messages = await SupportMessage.find({ userId }).sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});
router.put("/messages/mark-read/:userId", async (req, res) => {
  const { userId } = req.params;
  await SupportMessage.updateMany({ userId, isUnread: true }, { isUnread: false });
  res.status(200).send("Messages marked as read");
});

module.exports = router;
