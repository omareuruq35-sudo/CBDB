const Donor = require("../models/Donor");
const sendEmail = require("../utils/sendEmail");

// إضافة متبرع جديد
const createDonor = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      bloodType,
      governorate,
      nationalId,
      donationCount,
      lastDonationDate,
      notes,
      source,
    } = req.body;

    if (
      !fullName ||
      !email ||
      !phone ||
      !bloodType ||
      !governorate ||
      !nationalId
    ) {
      return res.status(400).json({
        message: "جميع الحقول المطلوبة يجب إدخالها",
      });
    }

    if (!/^\d{14}$/.test(nationalId)) {
      return res.status(400).json({
        message: "الرقم القومي يجب أن يكون 14 رقم",
      });
    }

    const existingDonor = await Donor.findOne({
      $or: [{ email }, { nationalId }],
    });

    if (existingDonor) {
      return res.status(400).json({
        message: "يوجد متبرع مسجل بالفعل بنفس الإيميل أو الرقم القومي",
      });
    }

    const donor = await Donor.create({
      fullName,
      email,
      phone,
      bloodType,
      governorate,
      nationalId,
      donationCount: donationCount || 0,
      lastDonationDate: lastDonationDate || null,
      notes: notes || "",
      source: source === "employee" ? "employee" : "user",
    });

    try {
      await sendEmail({
        to: donor.email,
        subject: "تم تسجيلك بنجاح في البنك المركزي المصري للتبرع بالدم",
html: `
  <div style="margin:0; padding:0; background-color:#f6f6f6; direction:rtl; font-family:Arial, Helvetica, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f6f6f6; padding:30px 0;">
      <tr>
        <td align="center">
          <table width="650" cellpadding="0" cellspacing="0" style="max-width:650px; width:100%; background-color:#ffffff; border-radius:18px; overflow:hidden; box-shadow:0 8px 30px rgba(0,0,0,0.08);">
            
            <tr>
              <td style="background:linear-gradient(135deg, #b71c1c, #d32f2f); padding:30px 25px; text-align:center;">
                <h1 style="margin:0; color:#ffffff; font-size:28px; font-weight:bold;">
                  البنك المركزي المصري للتبرع بالدم
                </h1>
                <p style="margin:10px 0 0; color:#ffeaea; font-size:15px;">
                  Central Blood Donation Bank
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:35px 30px 20px; text-align:right; color:#222;">
                <h2 style="margin:0 0 15px; color:#c62828; font-size:24px;">
                  مرحبًا ${donor.fullName} 👋
                </h2>

                <p style="margin:0 0 14px; font-size:16px; line-height:1.9;">
                  تم تسجيل بياناتك بنجاح في
                  <span style="font-weight:bold; color:#b71c1c;">
                    البنك المركزي المصري للتبرع بالدم
                  </span>.
                </p>

                <p style="margin:0 0 14px; font-size:16px; line-height:1.9;">
                  نشكرك على رغبتك في المساهمة بالتبرع بالدم، فكل قطرة دم يمكن أن تنقذ حياة إنسان.
                </p>

                <p style="margin:0 0 20px; font-size:16px; line-height:1.9;">
                  تم حفظ بياناتك لدينا بنجاح، وقد يتم التواصل معك عند الحاجة وفقًا لفصيلة الدم والمحافظة الخاصة بك.
                </p>

                <div style="background-color:#fff5f5; border:1px solid #f3c7c7; border-radius:14px; padding:18px 20px; margin:25px 0;">
                  <h3 style="margin:0 0 12px; color:#b71c1c; font-size:18px;">
                    بياناتك المسجلة
                  </h3>

                  <p style="margin:8px 0; font-size:15px;">
                    <strong>الاسم:</strong> ${donor.fullName}
                  </p>

                  <p style="margin:8px 0; font-size:15px;">
                    <strong>البريد الإلكتروني:</strong> ${donor.email}
                  </p>

                  <p style="margin:8px 0; font-size:15px;">
                    <strong>فصيلة الدم:</strong> ${donor.bloodType}
                  </p>

                  <p style="margin:8px 0; font-size:15px;">
                    <strong>المحافظة:</strong> ${donor.governorate}
                  </p>
                </div>

                <div style="text-align:center; margin:30px 0 10px;">
                  <a href="http://localhost:3000"
                     style="display:inline-block; background-color:#c62828; color:#ffffff; text-decoration:none; padding:14px 28px; border-radius:10px; font-size:15px; font-weight:bold;">
                    زيارة الموقع
                  </a>
                </div>

                <p style="margin:25px 0 0; font-size:14px; color:#666; line-height:1.8;">
                  هذه رسالة تلقائية لتأكيد التسجيل، برجاء عدم الرد عليها.
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
`
      });
    } catch (emailError) {
      console.error("Email sending error:", emailError);
    }

    return res.status(201).json({
      message: "تم تسجيل المتبرع بنجاح",
      donor,
    });
  } catch (error) {
    console.error("Create donor error:", error);
    return res.status(500).json({
      message: "حدث خطأ أثناء تسجيل المتبرع",
      error: error.message,
    });
  }
};

// جلب كل المتبرعين
const getAllDonors = async (req, res) => {
  try {
    const donors = await Donor.find().sort({ createdAt: -1 });

    return res.status(200).json(donors);
  } catch (error) {
    console.error("Get all donors error:", error);
    return res.status(500).json({
      message: "حدث خطأ أثناء جلب المتبرعين",
      error: error.message,
    });
  }
};

// حذف متبرع
const deleteDonor = async (req, res) => {
  try {
    const { id } = req.params;

    const donor = await Donor.findById(id);

    if (!donor) {
      return res.status(404).json({
        message: "المتبرع غير موجود",
      });
    }

    await donor.deleteOne();

    return res.status(200).json({
      message: "تم حذف المتبرع بنجاح",
    });
  } catch (error) {
    console.error("Delete donor error:", error);
    return res.status(500).json({
      message: "حدث خطأ أثناء حذف المتبرع",
      error: error.message,
    });
  }
};
// تسجيل عملية تبرع جديدة وتحديث بيانات المتبرع
const registerDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const { donationDate, notes } = req.body;

    const donor = await Donor.findById(id);

    if (!donor) {
      return res.status(404).json({ message: "المتبرع غير موجود" });
    }

    // تحديث البيانات
    donor.donationCount = (donor.donationCount || 0) + 1;
    donor.lastDonationDate = donationDate;
    if (notes) {
      donor.notes = notes;
    }

    await donor.save();

    return res.status(200).json({
      message: "تم تسجيل عملية التبرع بنجاح ✅",
      donor,
    });
  } catch (error) {
    console.error("Register donation error:", error);
    return res.status(500).json({
      message: "حدث خطأ أثناء تسجيل عملية التبرع",
      error: error.message,
    });
  }
};
module.exports = {
  createDonor,
  getAllDonors,
  deleteDonor,
  registerDonation, // تأكدي من إضافة هذه الكلمة
};