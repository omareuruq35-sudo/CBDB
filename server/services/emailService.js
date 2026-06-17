const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function buildEmergencyEmailHtml(donor, emergencyAd) {
  // توليد وقت إرسال ديناميكي بالثواني عشان نكسر كاش جوجل للمحتوى المتكرر
  const sendTime = new Date().toLocaleTimeString('ar-EG', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  });
  
  return `
    <div lang="ar" dir="rtl" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl; text-align: right; line-height: 1.8; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
      <h2 style="color: #b00020; margin-bottom: 20px; border-bottom: 2px solid #b00020; padding-bottom: 10px;">نداء تبرع دم طارئ 🩸</h2>

      <p>مرحبًا <strong>${donor.fullName || "متبرعنا العزيز"}</strong>،</p>

      <p>
        توجد حالة طارئة تحتاج إلى فصيلة دم 
        <span style="color: #b00020; font-weight: bold; font-size: 18px;">${emergencyAd.bloodType}</span> 
        داخل محافظة <strong>${emergencyAd.governorate || "الإسماعيلية"}</strong>.
      </p>

      <div style="background-color: #fff5f5; border-right: 4px solid #b00020; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <h4 style="margin-top: 0; color: #b00020; font-size: 16px;">📋 بيانات وتفاصيل الحالة:</h4>
        <p style="margin-bottom: 0; color: #333;">
          ${emergencyAd.message || "يرجى التوجه لأقرب مركز بنك دم للتبرع في أسرع وقت."}
        </p>
      </div>

      <p>
        إذا كنت قادرًا على التبرع حاليًا، يرجى التوجه إلى أقرب مركز بنك دم أو المستشفى المذكورة أعلاه.
      </p>

      <p style="font-weight: bold; color: #2e7d32;">
        شكرًا لك على مساهمتك النبيلة في إنقاذ حياة إنسان.
      </p>

      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />

      <table width="100%" style="direction: rtl; text-align: right;">
        <tr>
          <td style="color: #777; font-size: 14px;">
            مع تحيات،<br>
            <strong>فريق منصة بنك الدم المركزي</strong>
          </td>
          <td style="color: #bbb; font-size: 11px; text-align: left; vertical-align: bottom; direction: ltr;">
            Ref: #ALERT-${Math.floor(1000 + Math.random() * 9000)} | ${sendTime}
          </td>
        </tr>
      </table>
    </div>
  `;
}

async function sendEmergencyEmail(donor, emergencyAd) {
  if (!donor.email) {
    throw new Error("Donor email not found");
  }

  // توليد رقم تذكرة عشوائي في العنوان لمنع الـ Threading في Gmail
  const randomTicket = Math.floor(100 + Math.random() * 900);

  await transporter.sendMail({
    from: `"بنك الدم المركزي" <${process.env.EMAIL_USER}>`,
    to: donor.email,
    subject: `🚨 حالة طوارئ عاجلة [${randomTicket}]: مطلوب فصيلة ${emergencyAd.bloodType}`,
    html: buildEmergencyEmailHtml(donor, emergencyAd),
  });
}

module.exports = {
  sendEmergencyEmail,
};