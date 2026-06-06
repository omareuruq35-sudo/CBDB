const express = require("express");
const router = express.Router();

const {
  createDonor,
  getAllDonors,
  deleteDonor,
  registerDonation,
  updateDonor,
  saveDonorNotificationToken,
} = require("../controllers/donorController");

router.post("/", createDonor);
router.get("/", getAllDonors);
router.delete("/:id", deleteDonor);
router.put("/:id/donate", registerDonation);
router.put("/:id/notification-token", saveDonorNotificationToken);
router.put("/:id", updateDonor);

module.exports = router;