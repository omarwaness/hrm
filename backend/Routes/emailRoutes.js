  require('dotenv').config();
  const express = require('express');
  const nodemailer = require('nodemailer');
  const router = express.Router();

  // Create reusable transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true', // Convert string to boolean
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Verify connection configuration
  transporter.verify(function(error, success) {
    if (error) {
      console.log('SMTP connection error:', error);
    } else {
      console.log('SMTP server is ready to send messages');
    }
  });

  // Email sending endpoint
  router.post('/send', async (req, res) => {
    const { to, subject, message } = req.body;

    // Basic validation
    if (!to || !subject || !message) {
      return res.status(400).json({ error: 'Email, subject and message are required' });
    }

    try {
      const info = await transporter.sendMail({
        from: `"Job Board" <${process.env.FROM_EMAIL}>`, //a Include sender name
        to,
        subject,
        html: message,
      });

      console.log('Email sent: %s', info.messageId);
      res.status(200).json({ 
        success: true,
        message: 'Email sent successfully',
        messageId: info.messageId
      });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to send email',
        details: error.message
      });
    }
  });

  module.exports = router;