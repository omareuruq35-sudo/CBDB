const Donor = require("../models/Donor");

// إضافة متبرع جديد
const createDonor = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      bloodType,
      governorate,
      nationalId,
      donationCount,
      lastDonationDate,
      notes,
    } = req.body;

    if (!fullName || !email || !phone || !bloodType || !governorate || !nationalId) {
      return res.status(400).json({ message: "جميع الحقول مطلوبة" });
    }

    if (!/^\d{14}$/.test(nationalId)) {
      return res.status(400).json({ message: "الرقم القومي يجب أن يكون 14 رقم" });
    }

    const existingDonor = await Donor.findOne({
      $or: [{ email }, { nationalId }],
    });

    if (existingDonor) {
      return res.status(400).json({
        message: "المتبرع موجود بالفعل بالإيميل أو الرقم القومي",
      });
    }

    const donor = await Donor.create({
      fullName,
      email,
      phone,
      bloodType,
      governorate,
      nationalId,
      donationCount: donationCount || 0,
      lastDonationDate: lastDonationDate || null,
      notes: notes || "",
    });

    res.status(201).json({
      message: "تم تسجيل المتبرع بنجاح",
      donor,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// جلب كل المتبرعين
const getAllDonors = async (req, res) => {
  try {
    const donors = await Donor.find().sort({ createdAt: -1 });
    res.status(200).json(donors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// حذف متبرع
const deleteDonor = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);

    if (!donor) {
      return res.status(404).json({ message: "المتبرع غير موجود" });
    }

    await donor.deleteOne();

    res.status(200).json({ message: "تم حذف المتبرع بنجاح" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createDonor,
  getAllDonors,
  deleteDonor,
};