const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();  // Load .env

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
const activityRoutes = require("./routes/activity");

app.use("/auth", authRoutes);
app.use("/activity", activityRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB Error:", err));

// Default route
app.get("/", (req, res) => {
  res.send("API is working");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
