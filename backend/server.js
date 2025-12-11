const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const activityRoutes = require("./routes/activity");
app.use("/activity", activityRoutes);


// Connect to MongoDB Atlas
mongoose.connect("mongodb+srv://rjcodes114_db_user:Rejoy%40ProjectX@projectx.cnjswqp.mongodb.net/ProjectX")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("API is working");
});

app.listen(5000, () => console.log("Server running on port 5000"));
