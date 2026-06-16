// تعيين المتغيرات إجبارياً لتخطي مشكلة تشفير dotenvx مؤقتاً للتجربة
process.env.WHATSAPP_TOKEN = "EAAeYMMolveQBRgNLZC8OZBEOt7RQqwkZBxIiTjRZArQp4CZCXmdafvbvezOH6Dhoqap7nz0QYmoQsnoyt3NWzvC6L3dYGM3BD4hllquj8Eot2UygiL4mTXw6DimVgdRus3w22ERwa9LXXlMdNKiZBM6RrOpD0tt2axBZBQzI0b7pXzAFbZCSV8ZADhYgAc66ZCZCA1RsyRioZAq4O8xKQvn9TDhyWjkm8Qu6SgRhLxSeXdDMGsIsS7IS9wOvPYU5qYuERudY5h1vJho0YTHAODcRrLRJvAZDZD";
process.env.WHATSAPP_PHONE_NUMBER_ID = "1177760105419209";
process.env.WHATSAPP_TEMPLATE_NAME = "emergency_notification"; 
process.env.WHATSAPP_TEMPLATE_LANG = "ar"; 
const axios = require("axios");

function normalizePhoneForWhatsApp(phone) {
  if (!phone) return null;

  let cleaned = String(phone).replace(/\D/g, "");

  // لو الرقم مصري وبيبدأ بـ 0 زي 01012345678
  if (cleaned.startsWith("0")) {
    cleaned = "20" + cleaned.slice(1);
  }

  // لو مكتوب 00201012345678
  if (cleaned.startsWith("0020")) {
    cleaned = cleaned.slice(2);
  }

  return cleaned;
}

async function sendEmergencyWhatsApp(donor, emergencyAd) {
  console.log("الرمز الحالي في السيرفر هو:", process.env.WHATSAPP_TOKEN?.substring(0, 15));
  const to = normalizePhoneForWhatsApp(donor.phone);

  if (!to) {
    throw new Error("Donor phone not found");
  }

  const url = `https://graph.facebook.com/v25.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

  // بناء الـ payload مع تمرير المتغيرات الثلاثة بالترتيب المتوافق مع قالب Meta والفرونت إند
  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "template",
    template: {
      name: process.env.WHATSAPP_TEMPLATE_NAME || "emergency_notification",
      language: {
        code: process.env.WHATSAPP_TEMPLATE_LANG || "ar",
      },
      components: [
        {
          type: "body",
          parameters: [
            {
              type: "text",
              text: emergencyAd.bloodType || "غير محدد" // مكان {{1}} (مثال: +A)
            },
            {
              type: "text",
              text: emergencyAd.governorate || "الإسماعيلية" // مكان {{2}} (مثال: الإسماعيلية)
            },
            {
              type: "text",
              text: emergencyAd.message || "حالة حرجة مستعجلة" // مكان {{3}} (تم تعديل التسمية هنا لتقرأ النص بشكل صحيح)
            }
          ]
        }
      ]
    },
  };

  await axios.post(url, payload, {
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    },
  });
}

module.exports = {
  sendEmergencyWhatsApp,
};