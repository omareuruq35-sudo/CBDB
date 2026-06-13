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
  const to = normalizePhoneForWhatsApp(donor.phone);

  if (!to) {
    throw new Error("Donor phone not found");
  }

  const url = `https://graph.facebook.com/v20.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "template",
    template: {
      name: process.env.WHATSAPP_TEMPLATE_NAME,
      language: {
        code: process.env.WHATSAPP_TEMPLATE_LANG || "ar",
      },
      components: [
        {
          type: "body",
          parameters: [
            {
              type: "text",
              text: donor.name || "متبرعنا العزيز",
            },
            {
              type: "text",
              text: emergencyAd.bloodType,
            },
            {
              type: "text",
              text: emergencyAd.governorate,
            },
            {
              type: "text",
              text:
                emergencyAd.message ||
                "يرجى التوجه لأقرب مركز بنك دم للتبرع في أسرع وقت.",
            },
          ],
        },
      ],
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