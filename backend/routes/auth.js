const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// User Schema
const UserSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,

  // Added extra profile fields
  bio: String,
  profession: String,
  website: String
});

const User = mongoose.model("User", UserSchema);

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already used" });

    const user = new User({ fullName, email, password });
    await user.save();

    return res.json({ success: true, user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.password !== password) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    res.json({
      success: true,
      user: {
        userId: user._id,
        email: user.email,
        name: user.name || "",
        profession: user.profession || "",
        bio: user.bio || "",
        website: user.website || "",
        role: user.role
      }
    });

  } catch (err) {
    res.json({ success: false, message: "Server error" });
  }
});

// GET USER BY ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch {
    res.status(404).json({ message: "User not found" });
  }
});

// UPDATE USER
router.put("/:id", async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    return res.json({ success: true, user: updated });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Update failed" });
  }
});

module.exports = router;
