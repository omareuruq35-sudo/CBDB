require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const emergencyAdRoutes = require("./routes/emergencyAdRoutes");
const donorRoutes = require("./routes/donorRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");

// dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

console.log("emergencyAdRoutes =", emergencyAdRoutes);
console.log("donorRoutes =", donorRoutes);


app.use("/api/emergency-ads", emergencyAdRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/chatbot", chatbotRoutes);

app.get("/", (req, res) => {
  res.send("Emergency Ads API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

