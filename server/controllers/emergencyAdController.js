const EmergencyAd = require("../models/EmergencyAd");
const Donor = require("../models/Donor");
const sendEmail = require("../utils/sendEmail");
const sendPushNotification = require("../utils/sendPushNotification");


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

    // البحث عن المتبرعين المطابقين
    const eligibleDonors = await Donor.find({
      bloodType: bloodType,
      governorate: governorate.trim(),
      email: { $exists: true, $ne: "" },
      $or: [
        { lastDonationDate: null },
        { lastDonationDate: { $lte: threeMonthsAgo } },
      ],
    });

    console.log("========== EMERGENCY EMAIL DEBUG ==========");
    console.log("Blood Type:", bloodType);
    console.log("Governorate:", governorate.trim());
    console.log("Eligible Donors Count:", eligibleDonors.length);
    console.log(
      "Eligible Donors:",
      eligibleDonors.map((donor) => ({
        name: donor.fullName,
        email: donor.email,
        phone: donor.phone,
        bloodType: donor.bloodType,
        governorate: donor.governorate,
        lastDonationDate: donor.lastDonationDate,
      }))
    );
    console.log("==========================================");

    const emailResults = await Promise.allSettled(
      eligibleDonors.map((donor) =>
sendEmail({
  to: donor.email,
  subject: `تنبيه تبرع دم لفصيلة ${bloodType} في ${governorate}`,
  text: `مرحبًا ${donor.fullName}، توجد حالة تحتاج إلى فصيلة دم ${bloodType} داخل محافظة ${governorate}. بيانات الحالة: ${message}. إذا كنت قادرًا على التبرع، يرجى التوجه إلى أقرب مركز بنك دم مناسب. شكرًا لمساهمتك في إنقاذ حياة إنسان.`,
  html: `
    <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; line-height: 1.8; color: #222;">
      <h2>تنبيه تبرع دم</h2>

      <p>مرحبًا ${donor.fullName}،</p>

      <p>
        توجد حالة تحتاج إلى فصيلة دم
        <strong>${bloodType}</strong>
        داخل محافظة
        <strong>${governorate}</strong>.
      </p>

      <p>
        <strong>بيانات الحالة:</strong><br/>
        ${message}
      </p>

      <p>
        إذا كنت قادرًا على التبرع، يرجى التوجه إلى أقرب مركز بنك دم أو مستشفى مناسبة.
      </p>

      <p>
        شكرًا لمساهمتك في إنقاذ حياة إنسان.
      </p>

      <hr/>

      <p style="font-size: 13px; color: #666;">
        هذه رسالة تلقائية من منصة التبرع بالدم بناءً على بياناتك المسجلة كمتبرع.
      </p>
    </div>
  `,
})

)
    );

    const sentCount = emailResults.filter(
      (result) => result.status === "fulfilled"
    ).length;

    const failedCount = emailResults.filter(
      (result) => result.status === "rejected"
    ).length;

    console.log("Email Sent Count:", sentCount);
    console.log("Email Failed Count:", failedCount);
    console.log(
      "Email Errors:",
      emailResults
        .filter((result) => result.status === "rejected")
        .map((result) => result.reason?.message || result.reason)
    );

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

    const pushSentCount = pushResults.filter(
      (result) => result.status === "fulfilled"
    ).length;

    const pushFailedCount = pushResults.filter(
      (result) => result.status === "rejected"
    ).length;

    return res.status(201).json({
      message: "تم نشر الإعلان وإرسال الإيميل للمتبرعين المناسبين",

      matchedDonors: eligibleDonors.length,

      emailNotifiedDonors: sentCount,
      failedEmailNotifications: failedCount,

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