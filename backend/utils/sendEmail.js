const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTPEmail = async (to, otp, name) => {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;background:#f8f9ff;border-radius:16px;overflow:hidden">
      <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:32px;text-align:center">
        <h1 style="color:white;margin:0;font-size:24px">CareerWave</h1>
        <p style="color:#c7d2fe;margin:8px 0 0">Password Reset OTP</p>
      </div>
      <div style="padding:32px">
        <p style="color:#374151;font-size:15px">Hi <strong>${name}</strong>,</p>
        <p style="color:#6b7280;font-size:14px">Use the OTP below to reset your password. It expires in <strong>10 minutes</strong>.</p>
        <div style="background:#eef2ff;border:2px dashed #6366f1;border-radius:12px;padding:24px;text-align:center;margin:24px 0">
          <span style="font-size:36px;font-weight:900;letter-spacing:12px;color:#4f46e5">${otp}</span>
        </div>
        <p style="color:#9ca3af;font-size:12px">If you did not request this, please ignore this email.</p>
      </div>
    </div>
  `;
  await transporter.sendMail({
    from: `"CareerWave" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'CareerWave — Your OTP for Password Reset',
    html,
  });
};

module.exports = { sendOTPEmail };
