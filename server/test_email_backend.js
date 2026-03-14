import * as dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';

async function test() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    console.log('Connecting to Mongo...');
    await mongoose.connect(mongoUri);
    console.log('Connected to Mongo.');

    console.log('Testing SMTP connection...');
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Boolean(process.env.SMTP_SECURE === 'true'),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.verify();
    console.log('SMTP verified.');

    console.log('Sending test email...');
    const info = await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: process.env.CONTACT_RECIPIENT,
      subject: `Test portfolio contact`,
      text: 'This is a test message.',
    });
    console.log('Email sent:', info.messageId);

  } catch (error) {
    console.error('Error occurred:', error);
  } finally {
    await mongoose.disconnect();
  }
}

test();
