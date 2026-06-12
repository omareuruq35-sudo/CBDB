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

  for (const donor of matchedDonors) {
    // إرسال Email
    if (donor.email) {
      try {
        await sendEmergencyEmail(donor, emergencyAd);
        emailSent++;
      } catch (error) {
        emailFailed++;
        console.log("Email failed:", donor.email, error.message);
      }
    }

    // إرسال WhatsApp
    if (donor.phone) {
      try {
        await sendEmergencyWhatsApp(donor, emergencyAd);
        whatsappSent++;
      } catch (error) {
        whatsappFailed++;
        console.log(
          "WhatsApp failed:",
          donor.phone,
          error.response?.data || error.message
        );
      }
    }
  }

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