const express = require("express");
const router = express.Router();

const {
  createDonor,
  getAllDonors,
  deleteDonor,
  registerDonation, // استدعاء الفانكشن الجديدة
} = require("../controllers/donorController");

router.post("/", createDonor);
router.get("/", getAllDonors);
router.delete("/:id", deleteDonor);

// السطر السحري اللي بيشغل زرار التبرع
router.put("/:id/donate", registerDonation);

module.exports = router;