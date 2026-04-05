const express = require("express");
const router = express.Router();

const { createDonor, getAllDonors, deleteDonor } = require("../controllers/donorController");

// إضافة
router.post("/", createDonor);

// جلب
router.get("/", getAllDonors);

// حذف
router.delete("/:id", deleteDonor);

module.exports = router;