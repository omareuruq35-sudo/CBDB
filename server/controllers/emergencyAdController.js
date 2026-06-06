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
      governorate,
      message,
      duration: durationNumber,
      createdAtDate,
      expiresAtDate,
      isActive: true,
    });

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const eligibleDonors = await Donor.find({
      bloodType,
      governorate,
      email: { $exists: true, $ne: "" },
      $or: [
        { lastDonationDate: null },
        { lastDonationDate: { $lte: threeMonthsAgo } },
      ],
    });

    const emailResults = await Promise.allSettled(
      eligibleDonors.map((donor) =>
        sendEmail({
          to: donor.email,
          subject: "طلب تبرع دم عاجل",
          html: `
            <div style="margin:0; padding:0; background-color:#f6f6f6; direction:rtl; font-family:Arial, Helvetica, sans-serif;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f6f6f6; padding:30px 0;">
                <tr>
                  <td align="center">
                    <table width="650" cellpadding="0" cellspacing="0" style="max-width:650px; width:100%; background-color:#ffffff; border-radius:18px; overflow:hidden; box-shadow:0 8px 30px rgba(0,0,0,0.08);">
                      
                      <tr>
                        <td style="background:linear-gradient(135deg, #b71c1c, #d32f2f); padding:30px 25px; text-align:center;">
                          <h1 style="margin:0; color:#ffffff; font-size:28px; font-weight:bold;">
                            طلب تبرع دم عاجل
                          </h1>
                          <p style="margin:10px 0 0; color:#ffeaea; font-size:15px;">
                            Central Blood Donation Bank
                          </p>
                        </td>
                      </tr>

                      <tr>
                        <td style="padding:35px 30px 20px; text-align:right; color:#222;">
                          <h2 style="margin:0 0 15px; color:#c62828; font-size:24px;">
                            مرحبًا ${donor.fullName}
                          </h2>

                          <p style="margin:0 0 14px; font-size:16px; line-height:1.9;">
                            يوجد طلب تبرع عاجل لفصيلة دم
                            <strong style="color:#b71c1c;">${bloodType}</strong>
                            في محافظة
                            <strong style="color:#b71c1c;">${governorate}</strong>.
                          </p>

                          <div style="background-color:#fff5f5; border:1px solid #f3c7c7; border-radius:14px; padding:18px 20px; margin:25px 0;">
                            <h3 style="margin:0 0 12px; color:#b71c1c; font-size:18px;">
                              تفاصيل الحالة
                            </h3>

                            <p style="margin:8px 0; font-size:15px;">
                              <strong>فصيلة الدم المطلوبة:</strong> ${bloodType}
                            </p>

                            <p style="margin:8px 0; font-size:15px;">
                              <strong>المحافظة:</strong> ${governorate}
                            </p>

                            <p style="margin:8px 0; font-size:15px;">
                              <strong>رسالة الإعلان:</strong> ${message}
                            </p>

                            <p style="margin:8px 0; font-size:15px;">
                              <strong>مدة الإعلان:</strong> ${durationNumber} ساعة
                            </p>
                          </div>

                          <p style="margin:0 0 14px; font-size:16px; line-height:1.9;">
                            برجاء التوجه إلى أقرب بنك دم أو مستشفى إذا كنت قادرًا على التبرع.
                          </p>

                          <p style="margin:0 0 20px; font-size:17px; line-height:1.9; color:#b71c1c; font-weight:bold;">
                            تبرعك قد ينقذ حياة.
                          </p>

                          <div style="text-align:center; margin:30px 0 10px;">
                            <a href="http://localhost:3000/locations"
                               style="display:inline-block; background-color:#c62828; color:#ffffff; text-decoration:none; padding:14px 28px; border-radius:10px; font-size:15px; font-weight:bold;">
                              عرض أماكن بنوك الدم
                            </a>
                          </div>

                          <p style="margin:25px 0 0; font-size:14px; color:#666; line-height:1.8;">
                            هذه رسالة تلقائية من نظام البنك المركزي المصري للتبرع بالدم.
                          </p>
                        </td>
                      </tr>

                      <tr>
                        <td style="background-color:#fafafa; padding:18px 20px; text-align:center; border-top:1px solid #eeeeee;">
                          <p style="margin:0; font-size:13px; color:#888;">
                            © Central Blood Donation Bank - جميع الحقوق محفوظة
                          </p>
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>
              </table>
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
      message:
        "تم نشر الإعلان وإرسال الإيميل وإشعارات الويب للمتبرعين المناسبين",

      matchedDonors: eligibleDonors.length,

      notifiedDonors: sentCount,
      failedNotifications: failedCount,

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