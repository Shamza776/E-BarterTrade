// models/Message.js - Make sure this file name has the capital M
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    receiverId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    content: { 
      type: String, 
      required: true 
    },
  },
  { timestamps: true }
);

// Make sure to export correctly
module.exports = mongoose.model("Message", messageSchema);