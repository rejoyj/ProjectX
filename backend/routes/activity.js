const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Schema
const ActivitySchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    link: { type: String, required: true },
    note: { type: String, default: "" }
  },
  { timestamps: true }
);

const Activity = mongoose.model("Activity", ActivitySchema);

// ------------------------------------------------------
// GET — all activity of a user
// ------------------------------------------------------
router.get("/:userId", async (req, res) => {
  try {
    const logs = await Activity.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });

    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------------------------------------------
// POST — add new activity entry
// ------------------------------------------------------
router.post("/", async (req, res) => {
  try {
    const entry = new Activity(req.body);
    await entry.save();
    res.json({ success: true, activity: entry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to add activity" });
  }
});

module.exports = router;
