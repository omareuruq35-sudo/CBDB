const express = require("express");
const {
  createEmergencyAd,
  getActiveEmergencyAds,
  deleteEmergencyAd,
} = require("../controllers/emergencyAdController");

const router = express.Router();

router.post("/", createEmergencyAd);
router.get("/", getActiveEmergencyAds);
router.delete("/:id", deleteEmergencyAd);

module.exports = router;