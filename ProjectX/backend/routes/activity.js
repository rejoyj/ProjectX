const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
  userId: String,
  date: String,
  time: String,
  link: String,
  note: String,
});

const Activity = mongoose.model("Activity", ActivitySchema);

// Get all activity for a user
router.get("/:userId", async (req, res) => {
  try {
    const logs = await Activity.find({ userId: req.params.userId });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
