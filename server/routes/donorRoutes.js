const express = require("express");
const router = express.Router();

const {
  createDonor,
  getAllDonors,
  deleteDonor,
} = require("../controllers/donorController");

router.post("/", createDonor);
router.get("/", getAllDonors);
router.delete("/:id", deleteDonor);

module.exports = router;