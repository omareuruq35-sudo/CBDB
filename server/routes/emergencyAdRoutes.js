const express = require("express");
const {
  createEmergencyAd,
  getActiveEmergencyAds,
} = require("../controllers/emergencyAdController");

const router = express.Router();

router.post("/", createEmergencyAd);
router.get("/", getActiveEmergencyAds);

module.exports = router;