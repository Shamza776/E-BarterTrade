const express = require("express");
const Skill = require("../models/Skill");
const router = express.Router();

// ✅ Add a New Skill
router.post("/new", async (req, res) => {
  try {
    const { userId, title, category, description, availability, location } = req.body;

    if (!userId || !title || !category || !description || !availability || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newSkill = new Skill({ userId, title, category, description, availability, location });
    await newSkill.save();

    res.status(201).json(newSkill);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get All Skills for a Specific User
router.get("/:userId", async (req, res) => {
  try {
    const skills = await Skill.find({ userId: req.params.userId });

    if (!skills.length) {
      return res.status(404).json({ message: "No skills found" });
    }

    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Edit a Skill
router.put("/:skillId", async (req, res) => {
    try {
      const { title, category, description, availability, location } = req.body;
      const skill = await Skill.findByIdAndUpdate(
        req.params.skillId,
        { title, category, description, availability, location },
        { new: true } // Return the updated skill
      );
  
      if (!skill) {
        return res.status(404).json({ message: "Skill not found" });
      }
  
      res.json(skill);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // ✅ Delete a Skill
  router.delete("/:skillId", async (req, res) => {
    try {
      const skill = await Skill.findByIdAndDelete(req.params.skillId);
      if (!skill) {
        return res.status(404).json({ message: "Skill not found" });
      }
  
      res.json({ message: "Skill deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

module.exports = router;
