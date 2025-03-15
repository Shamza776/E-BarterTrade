const express = require("express");
const Message = require("../models/Message");
const router = express.Router();

// ✅ Send a Message (Store in DB)
router.post("/", async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;

    if (!senderId || !receiverId || !content) {
      return res.status(400).json({ message: "All fields are required" });
    }

    console.log(`🟢 New Message from ${senderId} to ${receiverId}: ${content}`);

    const newMessage = new Message({ senderId, receiverId, content });
    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (err) {
    console.error("❌ Error saving message:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Fetch Messages Between Two Users
router.get("/:user1/:user2", async (req, res) => {
  try {
    console.log(`🟡 Fetching messages between ${req.params.user1} and ${req.params.user2}`);

    const messages = await Message.find({
      $or: [
        { senderId: req.params.user1, receiverId: req.params.user2 },
        { senderId: req.params.user2, receiverId: req.params.user1 },
      ],
    }).sort({ createdAt: 1 });

    console.log("✅ Messages retrieved:", messages);
    res.json(messages);
  } catch (err) {
    console.error("❌ Error fetching messages:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
