const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"البنك المركزي المصري للتبرع بالدم" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text: text || subject,
    html,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;