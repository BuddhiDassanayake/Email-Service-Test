// 1. Load secret credentials from .env
require('dotenv').config();

// 2. Import Express (web framework) and Nodemailer (email library)
const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;

// 3. Middleware: allows Express to read JSON sent from Postman
app.use(express.json());

// 4. Configure Nodemailer with your Gmail credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 5. The API route that receives data from Postman
app.post('/api/send-email', async (req, res) => {
  console.log('\n📬 Received request from Postman:');
  console.log('To:     ', req.body.to);
  console.log('Subject:', req.body.subject);
  console.log('Text:   ', req.body.text);

  try {
    // Send email using data from Postman
    const info = await transporter.sendMail({
      from: `"Email Service" <${process.env.EMAIL_USER}>`,
      to: req.body.to,
      subject: req.body.subject,
      text: req.body.text,
      html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>${req.body.subject}</h2>
        <p>${req.body.text}</p>
      </div>`,
    });

    console.log('✅ Email delivered! Message ID:', info.messageId);

    // Reply back to Postman
    res.json({
      success: true,
      message: 'Email sent successfully!',
      messageId: info.messageId,
    });
  } catch (error) {
    console.error('❌ Failed to send:', error.message);

    // Reply back with error
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// 6. Start the server
app.listen(PORT, () => {
  console.log(`\n==============================================`);
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
  console.log(`📡 Ready for Postman: POST http://localhost:${PORT}/api/send-email`);
  console.log(`==============================================\n`);
});
