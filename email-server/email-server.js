
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Set up email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

// Contact endpoint
app.post('/contact', async (req, res) => {
  try {
    const { name, email, message, captchaToken, subject } = req.body;
    
    console.log('Received contact form submission:', { name, email, message });
    
    // Validate required fields
    if (!name || !email || !message || !captchaToken) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }
    
    // Email content
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: subject ? subject : `Contact Form Submission from ${name}`,
      text: `
Name: ${name}
Email: ${email}
Message: ${message}
      `,
      html: `
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Message:</strong> ${message}</p>
      `
    };
    
    // Send email
    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ 
      success: true, 
      message: 'Your message has been sent successfully!'
    });
  } catch (error) {
    console.error('Email sending error:', error);
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send email. Please try again later.'
    });
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).send('Email service is running');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Email server running on port ${PORT}`);
});
