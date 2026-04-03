const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const emergencyAdsRoutes = require("./routes/emergencyAdsRoutes");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log("DB connection error:", err.message));

app.use("/api/emergency-ads", emergencyAdsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});