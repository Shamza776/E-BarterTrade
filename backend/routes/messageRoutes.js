// routes/messageRoutes.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Import your models - IMPORTANT: double-check these paths
const Message = require("../models/message");
const User = require("../models/user");

// Add a debugging route to verify the model
router.get("/debug", (req, res) => {
  console.log("Message model:", Message);
  console.log("Is find a function:", typeof Message.find === "function");
  res.json({ 
    modelName: Message.modelName,
    hasFindFunction: typeof Message.find === "function"
  });
});

// Conversations route
router.get("/conversations/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log("Fetching conversations for user:", userId);
    
    // Try with regular find query
    const messages = await Message.find({
      $or: [
        { senderId: userId }, 
        { receiverId: userId }
      ]
    }).sort({ createdAt: -1 }).limit(20);
    
    console.log("Found messages:", messages.length);
    
    // Get unique users
    const userIds = new Set();
    messages.forEach(msg => {
      const otherUserId = msg.senderId.toString() === userId ? 
        msg.receiverId.toString() : msg.senderId.toString();
      userIds.add(otherUserId);
    });
    
    // Convert to array for querying
    const userIdsArray = Array.from(userIds);
    console.log("Found unique users:", userIdsArray.length);
    
    // Find users
    const users = await User.find({
      _id: { $in: userIdsArray }
    });
    
    console.log("Retrieved users:", users.length);
    
    // Format data
    const formattedConversations = users.map(user => {
      const lastMessage = messages.find(msg => 
        msg.senderId.toString() === user._id.toString() || 
        msg.receiverId.toString() === user._id.toString()
      );
      
      return {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email
        },
        lastMessage: lastMessage ? lastMessage.content : "No messages yet"
      };
    });
    
    res.json(formattedConversations);
  } catch (err) {
    console.error("❌ Error fetching conversations:", err);
    res.status(500).json({ message: err.message });
  }
});

// Rest of your routes...
// Fetch Messages Between Two Users
router.get("/:user1/:user2", async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.params.user1, receiverId: req.params.user2 },
        { senderId: req.params.user2, receiverId: req.params.user1 },
      ],
    }).sort({ createdAt: 1 });
    
    res.json(messages);
  } catch (err) {
    console.error("❌ Error fetching messages:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Send a message
router.post("/", async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;
    
    if (!senderId || !receiverId || !content) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    const newMessage = new Message({ senderId, receiverId, content });
    await newMessage.save();
    
    res.status(201).json(newMessage);
  } catch (err) {
    console.error("❌ Error sending message:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;