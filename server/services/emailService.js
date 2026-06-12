const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function buildEmergencyEmailHtml(donor, emergencyAd) {
  return `
    <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; line-height: 1.8;">
      <h2 style="color: #b00020;">نداء تبرع دم طارئ</h2>

      <p>مرحبًا ${donor.name || "متبرعنا العزيز"}،</p>

      <p>
        توجد حالة طارئة تحتاج إلى فصيلة دم
        <strong>${emergencyAd.bloodType}</strong>
        داخل محافظة
        <strong>${emergencyAd.governorate}</strong>.
      </p>

      <h3>بيانات الحالة:</h3>

      <p>
        ${emergencyAd.message || "يرجى التوجه لأقرب مركز بنك دم للتبرع في أسرع وقت."}
      </p>

      <p>
        إذا كنت قادرًا على التبرع حاليًا، يرجى التوجه إلى أقرب مركز بنك دم أو مستشفى مناسبة.
      </p>

      <p>
        شكرًا لك على مساهمتك في إنقاذ حياة إنسان.
      </p>

      <p style="color: #777;">
        فريق منصة التبرع بالدم
      </p>
    </div>
  `;
}

async function sendEmergencyEmail(donor, emergencyAd) {
  if (!donor.email) {
    throw new Error("Donor email not found");
  }

  await transporter.sendMail({
    from: `"Blood Donation Platform" <${process.env.EMAIL_USER}>`,
    to: donor.email,
    subject: `حالة طوارئ تحتاج فصيلة ${emergencyAd.bloodType}`,
    html: buildEmergencyEmailHtml(donor, emergencyAd),
  });
}

module.exports = {
  sendEmergencyEmail,
};