const EmergencyAd = require("../models/EmergencyAd");

// دالة تنسيق التاريخ بالعربي المصري
const formatArabicDate = (date) => {
  return new Date(date).toLocaleString("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

// دالة تحسب من قد إيه الإعلان اتحدث
const getUpdatedAgo = (date) => {
  const now = new Date();
  const updated = new Date(date);
  const diffMs = now - updated;

  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));

  if (minutes < 1) return "الآن";
  if (minutes < 60) return `منذ ${minutes} دقيقة`;
  if (hours < 24) return `منذ ${hours} ساعة`;

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return `منذ ${days} يوم`;
};

// تحديث حالة الإعلانات المنتهية
const deactivateExpiredAds = async () => {
  const now = new Date();

  await EmergencyAd.updateMany(
    {
      isActive: true,
      expiresAtDate: { $lte: now },
    },
    {
      $set: { isActive: false },
    }
  );
};

// POST /api/emergency-ads
const createEmergencyAd = async (req, res) => {
  try {
    const { bloodType, governorate, message, duration } = req.body;

    if (!bloodType || !governorate || !message || !duration) {
      return res.status(400).json({
        message: "من فضلك كمّل كل البيانات المطلوبة",
      });
    }

    const createdAtDate = new Date();
    const expiresAtDate = new Date(
      createdAtDate.getTime() + Number(duration) * 60 * 60 * 1000
    );

    const newAd = await EmergencyAd.create({
      bloodType,
      governorate,
      message,
      duration,
      createdAtDate,
      expiresAtDate,
      isActive: true,
    });

    return res.status(201).json({
      message: "تم نشر الإعلان بنجاح",
      ad: {
        id: newAd._id,
        bloodType: newAd.bloodType,
        governorate: newAd.governorate,
        message: newAd.message,
        duration: newAd.duration,
        createdAt: formatArabicDate(newAd.createdAtDate),
        expiresAt: formatArabicDate(newAd.expiresAtDate),
        updatedAgo: getUpdatedAgo(newAd.updatedAt),
        locationNote: "مستشفى تحتاج متبرعين",
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "حصل خطأ أثناء نشر الإعلان",
      error: error.message,
    });
  }
};

// GET /api/emergency-ads
const getActiveEmergencyAds = async (req, res) => {
  try {
    await deactivateExpiredAds();

    const ads = await EmergencyAd.find({ isActive: true }).sort({ createdAtDate: -1 });

    const formattedAds = ads.map((ad) => ({
      id: ad._id.toString(),
      bloodType: ad.bloodType,
      governorate: ad.governorate,
      message: ad.message,
      duration: ad.duration,
      createdAt: formatArabicDate(ad.createdAtDate),
      expiresAt: formatArabicDate(ad.expiresAtDate),
      updatedAgo: getUpdatedAgo(ad.updatedAt),
      locationNote: "منطقة تحتاج متبرعين",
    }));

    const lastUpdated = ads.length > 0 ? formatArabicDate(ads[0].updatedAt) : "لا يوجد";

    res.status(200).json({
      ads: formattedAds,
      activeCount: formattedAds.length,
      lastUpdated,
    });
  } catch (error) {
    res.status(500).json({
      message: "حصل خطأ أثناء جلب الإعلانات",
      error: error.message,
    });
  }
};

// DELETE /api/emergency-ads/:id
const deleteEmergencyAd = async (req, res) => {
  try {
    const { id } = req.params;

    const ad = await EmergencyAd.findById(id);

    if (!ad) {
      return res.status(404).json({
        message: "الإعلان غير موجود",
      });
    }

    ad.isActive = false;
    await ad.save();

    return res.status(200).json({
      message: "تم حذف الإعلان بنجاح",
      id: ad._id.toString(),
    });
  } catch (error) {
    res.status(500).json({
      message: "حصل خطأ أثناء حذف الإعلان",
      error: error.message,
    });
  }
};

module.exports = {
  createEmergencyAd,
  getActiveEmergencyAds,
  deleteEmergencyAd,
};