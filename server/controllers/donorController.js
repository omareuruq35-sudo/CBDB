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
      source,
    } = req.body;

    if (
      !fullName ||
      !email ||
      !phone ||
      !bloodType ||
      !governorate ||
      !nationalId
    ) {
      return res.status(400).json({
        message: "جميع الحقول المطلوبة يجب إدخالها",
      });
    }

    if (!/^\d{14}$/.test(nationalId)) {
      return res.status(400).json({
        message: "الرقم القومي يجب أن يكون 14 رقم",
      });
    }

    const existingDonor = await Donor.findOne({
      $or: [{ email }, { nationalId }],
    });

    if (existingDonor) {
      return res.status(400).json({
        message: "يوجد متبرع مسجل بالفعل بنفس الإيميل أو الرقم القومي",
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
      source: source === "employee" ? "employee" : "user",
    });

    return res.status(201).json({
      message: "تم تسجيل المتبرع بنجاح",
      donor,
    });
  } catch (error) {
    console.error("Create donor error:", error);
    return res.status(500).json({
      message: "حدث خطأ أثناء تسجيل المتبرع",
      error: error.message,
    });
  }
};

// جلب كل المتبرعين
const getAllDonors = async (req, res) => {
  try {
    const donors = await Donor.find().sort({ createdAt: -1 });

    return res.status(200).json(donors);
  } catch (error) {
    console.error("Get all donors error:", error);
    return res.status(500).json({
      message: "حدث خطأ أثناء جلب المتبرعين",
      error: error.message,
    });
  }
};

// حذف متبرع
const deleteDonor = async (req, res) => {
  try {
    const { id } = req.params;

    const donor = await Donor.findById(id);

    if (!donor) {
      return res.status(404).json({
        message: "المتبرع غير موجود",
      });
    }

    await donor.deleteOne();

    return res.status(200).json({
      message: "تم حذف المتبرع بنجاح",
    });
  } catch (error) {
    console.error("Delete donor error:", error);
    return res.status(500).json({
      message: "حدث خطأ أثناء حذف المتبرع",
      error: error.message,
    });
  }
};
// تسجيل عملية تبرع جديدة وتحديث بيانات المتبرع
const registerDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const { donationDate, notes } = req.body;

    const donor = await Donor.findById(id);

    if (!donor) {
      return res.status(404).json({ message: "المتبرع غير موجود" });
    }

    // تحديث البيانات
    donor.donationCount = (donor.donationCount || 0) + 1;
    donor.lastDonationDate = donationDate;
    if (notes) {
      donor.notes = notes;
    }

    await donor.save();

    return res.status(200).json({
      message: "تم تسجيل عملية التبرع بنجاح ✅",
      donor,
    });
  } catch (error) {
    console.error("Register donation error:", error);
    return res.status(500).json({
      message: "حدث خطأ أثناء تسجيل عملية التبرع",
      error: error.message,
    });
  }
};
module.exports = {
  createDonor,
  getAllDonors,
  deleteDonor,
  registerDonation, // تأكدي من إضافة هذه الكلمة
};