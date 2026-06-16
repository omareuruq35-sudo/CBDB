const EmergencyAd = require("../models/EmergencyAd");
const Donor = require("../models/Donor");
const sendEmail = require("../utils/sendEmail");
const sendPushNotification = require("../utils/sendPushNotification");
// 1. استدعاء دالة إرسال الواتساب من السيرفيس اللي عملناها سوا
const { sendEmergencyWhatsApp } = require("../services/whatsappService");

// دالة تنسيق التاريخ
const formatArabicDate = (date) => {
  return new Date(date).toLocaleString("en-GB", {
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

    const durationNumber = Number(duration);

    const createdAtDate = new Date();
    const expiresAtDate = new Date(
      createdAtDate.getTime() + durationNumber * 60 * 60 * 1000
    );

    const newAd = await EmergencyAd.create({
      bloodType,
      governorate: governorate.trim(),
      message,
      duration: durationNumber,
      createdAtDate,
      expiresAtDate,
      isActive: true,
    });

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    // 2. تعديل الـ Query: شيلنا شرط الإيميل الإجباري عشان نجيب المتبرعين بالهاتف أيضاً للواتساب
    const eligibleDonors = await Donor.find({
      bloodType: bloodType,
      governorate: governorate.trim(),
      $or: [
        { lastDonationDate: null },
        { lastDonationDate: { $lte: threeMonthsAgo } },
      ],
    });

    console.log("========== EMERGENCY DEBUG ==========");
    console.log("Blood Type:", bloodType);
    console.log("Governorate:", governorate.trim());
    console.log("Eligible Donors Count:", eligibleDonors.length);
    console.log("==========================================");

    // ---------------- [ إرسال الإيميلات ] ----------------
    const emailDonors = eligibleDonors.filter(donor => donor.email && donor.email !== "");
    const emailResults = await Promise.allSettled(
      emailDonors.map((donor) =>
        sendEmail({
          to: donor.email,
          subject: `تنبيه تبرع دم لفصيلة ${bloodType} في ${governorate}`,
          text: `مرحبًا ${donor.fullName}، توجد حالة تحتاج إلى فصيلة دم ${bloodType} داخل محافظة ${governorate}.`,
          html: `<div style="direction: rtl; text-align: right;"><h2>تنبيه تبرع دم</h2><p>مرحبًا ${donor.fullName}...</p></div>`, // اختصرتها هنا عشان المساحة، سيب كود الـ HTML بتاعك زي ما هو
        })
      )
    );

    const emailSentCount = emailResults.filter((result) => result.status === "fulfilled").length;
    const emailFailedCount = emailResults.filter((result) => result.status === "rejected").length;


    // ---------------- [ إرسال الواتساب ] ----------------
    // فلترة المتبرعين اللي عندهم رقم تليفون مسجل
    const whatsappDonors = eligibleDonors.filter(donor => donor.phone && donor.phone !== "");
    const whatsappResults = await Promise.allSettled(
      whatsappDonors.map((donor) => sendEmergencyWhatsApp(donor, newAd))
    );

    const whatsappSentCount = whatsappResults.filter((result) => result.status === "fulfilled").length;
    const whatsappFailedCount = whatsappResults.filter((result) => result.status === "rejected").length;

    // طباعة أخطاء الواتساب لو ظهرت في الـ Console للـ Debugging
    console.log("WhatsApp Sent:", whatsappSentCount, "Failed:", whatsappFailedCount);
    whatsappResults.forEach((res, idx) => {
      if (res.status === "rejected") {
        console.error(`خطأ تليفون ${whatsappDonors[idx].phone}:`, res.reason?.message || res.reason);
      }
    });


    // ---------------- [ إرسال الـ Push Notifications ] ----------------
    const pushDonors = eligibleDonors.filter(
      (donor) => donor.notificationAllowed === true && donor.fcmToken
    );

    const pushResults = await Promise.allSettled(
      pushDonors.map((donor) =>
        sendPushNotification({
          token: donor.fcmToken,
          title: "طلب تبرع دم عاجل",
          body: `مطلوب فصيلة ${bloodType} في ${governorate}. ${message}`,
          data: {
            type: "emergency_ad",
            adId: newAd._id.toString(),
            bloodType: String(bloodType),
            governorate: String(governorate),
            duration: String(durationNumber),
          },
        })
      )
    );

    const pushSentCount = pushResults.filter((result) => result.status === "fulfilled").length;
    const pushFailedCount = pushResults.filter((result) => result.status === "rejected").length;

    // الـ Response النهائي شامل إحصائيات الواتساب الجديدة
    return res.status(201).json({
      message: "تم نشر الإعلان وإرسال التنبيهات للمتبرعين المناسبين عبر القنوات المتاحة",
      matchedDonors: eligibleDonors.length,

      emailNotifiedDonors: emailSentCount,
      failedEmailNotifications: emailFailedCount,

      whatsappNotifiedDonors: whatsappSentCount,
      failedWhatsAppNotifications: whatsappFailedCount,

      pushMatchedDonors: pushDonors.length,
      pushNotifiedDonors: pushSentCount,
      failedPushNotifications: pushFailedCount,

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
    console.error("Create emergency ad error:", error);
    return res.status(500).json({
      message: "حصل خطأ أثناء نشر الإعلان",
      error: error.message,
    });
  }
};

// GET /api/emergency-ads
const getActiveEmergencyAds = async (req, res) => {
  try {
    await deactivateExpiredAds();

    const ads = await EmergencyAd.find({ isActive: true }).sort({
      createdAtDate: -1,
    });

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

    const lastUpdated =
      ads.length > 0 ? formatArabicDate(ads[0].updatedAt) : "لا يوجد";

    return res.status(200).json({
      ads: formattedAds,
      activeCount: formattedAds.length,
      lastUpdated,
    });
  } catch (error) {
    return res.status(500).json({
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
    return res.status(500).json({
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