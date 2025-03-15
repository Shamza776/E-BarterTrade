const express = require("express");
const User = require("../models/user"); // Import User model
const router = express.Router();

// ✅ Get All Users (Return name, email & location)
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, "name email location"); // Fetch only relevant fields
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
