const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Email not configured. Set EMAIL_USER and EMAIL_PASS in .env');
    console.log(`Would send: ${subject} to ${to}`);
    return { message: 'Email would be sent (configure SMTP)' };
  }

  try {
    await transporter.sendMail({
      from: `"Spin-to-Dine" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
    return { message: 'Email sent' };
  } catch (error) {
    console.error('Email send error:', error);
    throw error;
  }
};

module.exports = { sendEmail };
