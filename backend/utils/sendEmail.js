const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Email configuration missing. Set EMAIL_USER and EMAIL_PASS in backend .env");
  }

  if (
    process.env.EMAIL_USER === "your_email@gmail.com" ||
    process.env.EMAIL_PASS === "your_app_password"
  ) {
    throw new Error("Replace placeholder EMAIL_USER and EMAIL_PASS with real Gmail credentials");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    tls: {
      // Helps local development in environments that intercept TLS certificates.
      rejectUnauthorized: process.env.NODE_ENV === "production",
    },
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;