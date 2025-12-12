const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// USER SCHEMA
const UserSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,
  bio: String,
  profession: String,
  website: String
});

const User = mongoose.model("User", UserSchema);

// HELPER → Format user object sent to frontend
function formatUser(u) {
  return {
    _id: u._id,
    fullName: u.fullName,
    email: u.email,
    bio: u.bio || "",
    profession: u.profession || "",
    website: u.website || ""
  };
}

// ---------------------------------------------------
// SIGNUP
// ---------------------------------------------------
router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.json({
        success: false,
        message: "Email already registered"
      });
    }

    const newUser = new User({ fullName, email, password });
    await newUser.save();

    return res.json({
      success: true,
      user: formatUser(newUser)
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Server error" });
  }
});

// ---------------------------------------------------
// LOGIN
// ---------------------------------------------------
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

    return res.json({
      success: true,
      user: formatUser(user)
    });

  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Server error" });
  }
});

// ---------------------------------------------------
// GET USER BY ID
// ---------------------------------------------------
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.json({ success: false, message: "Not found" });

    return res.json(formatUser(user));
  } catch {
    res.json({ success: false, message: "Error fetching user" });
  }
});

// ---------------------------------------------------
// UPDATE USER
// ---------------------------------------------------
router.put("/:id", async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    return res.json({
      success: true,
      user: formatUser(updated)
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Update failed" });
  }
});

module.exports = router;
