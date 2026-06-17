const Donor = require("../models/Donor");
const { sendEmergencyEmail } = require("./emailService");
const { sendEmergencyWhatsApp } = require("./whatsappService");

async function notifyMatchedDonors(emergencyAd) {
  const matchedDonors = await Donor.find({
    bloodType: emergencyAd.bloodType,
    governorate: emergencyAd.governorate,
  });

  let emailSent = 0;
  let emailFailed = 0;
  let whatsappSent = 0;
  let whatsappFailed = 0;

  // 1. هنعمل الخريطة (Map) لتجهيز كل الوعود (Promises) بدون انتظارها فوراً
  const notificationPromises = matchedDonors.map(async (donor) => {
    
    // معالجة الإيميل لكل متبرع بشكل مستقل
    if (donor.email) {
      try {
        await sendEmergencyEmail(donor, emergencyAd);
        emailSent++;
      } catch (error) {
        emailFailed++;
        console.log(`Email failed for ${donor.email}:`, error.message);
      }
    }

    // معالجة الواتساب لكل متبرع بشكل مستقل
    if (donor.phone) {
      try {
        // نصيحة: هنا بنبعت الـ emergencyAd والخدمة جواها تصيغ النص جوه الـ Variable {{1}}
        await sendEmergencyWhatsApp(donor, emergencyAd);
        whatsappSent++;
      } catch (error) {
        whatsappFailed++;
        console.log(`WhatsApp failed for ${donor.phone}:`, error.response?.data || error.message);
      }
    }
  });

  // 2. تشغيل كل الإرساليات "في نفس الوقت" دفعة واحدة وانتظار انتهاء الجميع
  await Promise.all(notificationPromises);

  // 3. رجوع التقرير النهائي فوراً
  return {
    matchedDonors: matchedDonors.length,
    emailSent,
    emailFailed,
    whatsappSent,
    whatsappFailed,
  };
}

module.exports = {
  notifyMatchedDonors,
};