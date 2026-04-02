const EmergencyAd = require("../models/EmergencyAd");

// إنشاء إعلان جديد
const createEmergencyAd = async (req, res) => {
  try {
    const { bloodType, governorate, message, duration } = req.body;

    if (!bloodType || !governorate || !message || !duration) {
      return res.status(400).json({
        success: false,
        message: "من فضلك املي كل البيانات المطلوبة",
      });
    }

    const expiresAt = new Date(Date.now() + Number(duration) * 60 * 60 * 1000);

    const newAd = await EmergencyAd.create({
      bloodType,
      governorate,
      message,
      duration,
      expiresAt,
    });

    res.status(201).json({
      success: true,
      message: "تم نشر الإعلان بنجاح",
      data: newAd,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "حصل خطأ أثناء إنشاء الإعلان",
      error: error.message,
    });
  }
};

// جلب كل الإعلانات
const getAllEmergencyAds = async (req, res) => {
  try {
    const ads = await EmergencyAd.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      results: ads.length,
      data: ads,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "حصل خطأ أثناء جلب الإعلانات",
      error: error.message,
    });
  }
};

// جلب الإعلانات النشطة فقط
const getActiveEmergencyAds = async (req, res) => {
  try {
    const now = new Date();

    await EmergencyAd.updateMany(
      { expiresAt: { $lt: now }, isActive: true },
      { isActive: false }
    );

    const ads = await EmergencyAd.find({
      isActive: true,
      expiresAt: { $gt: now },
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      results: ads.length,
      data: ads,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "حصل خطأ أثناء جلب الإعلانات النشطة",
      error: error.message,
    });
  }
};

// حذف إعلان
const deleteEmergencyAd = async (req, res) => {
  try {
    const { id } = req.params;

    const ad = await EmergencyAd.findByIdAndDelete(id);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "الإعلان غير موجود",
      });
    }

    res.status(200).json({
      success: true,
      message: "تم حذف الإعلان بنجاح",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "حصل خطأ أثناء حذف الإعلان",
      error: error.message,
    });
  }
};

module.exports = {
  createEmergencyAd,
  getAllEmergencyAds,
  getActiveEmergencyAds,
  deleteEmergencyAd,
};