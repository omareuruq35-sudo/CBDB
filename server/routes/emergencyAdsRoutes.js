const express = require("express");
const router = express.Router();

const {
  createEmergencyAd,
  getAllEmergencyAds,
  getActiveEmergencyAds,
  deleteEmergencyAd,
} = require("../controllers/emergencyAdsController");

router.post("/", createEmergencyAd);
router.get("/", getAllEmergencyAds);
router.get("/active", getActiveEmergencyAds);
router.delete("/:id", deleteEmergencyAd);

module.exports = router;