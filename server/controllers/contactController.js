import ContactMessage from '../models/ContactMessage.js';
import nodemailer from 'nodemailer';

export const handleContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Name, email, and message are required.' });
    }

    let docId = null;
    try {
      const doc = await ContactMessage.create({ name, email, phone, message });
      docId = doc._id;
    } catch (dbError) {
      console.warn('Failed to save contact message to database, proceeding with email anyway:', dbError.message);
    }

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.CONTACT_RECIPIENT) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Boolean(process.env.SMTP_SECURE === 'true'),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Portfolio Contact" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: process.env.CONTACT_RECIPIENT,
        subject: `New portfolio contact from ${name}`,
        text: [
          `Name: ${name}`,
          `Email: ${email}`,
          phone ? `Phone: ${phone}` : null,
          '',
          'Message:',
          message,
        ]
          .filter(Boolean)
          .join('\n'),
      });

      // Send auto-reply to the user
      await transporter.sendMail({
        from: `"Kartikeya" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: email,
        subject: `Thank you for reaching out!`,
        text: `Hi ${name},\n\nThank you for getting in touch! I have received your message and will get back to you as soon as possible.\n\nHere is a copy of your message:\n\n"${message}"\n\nBest regards,\nKartikeya\n\n(This is an automated confirmation email)`
      });
    }

    return res.status(201).json({ success: true, data: { id: docId } });
  } catch (error) {
    console.error('Error handling contact message', error);
    return res.status(500).json({ success: false, error: 'Failed to submit message. Please try again later.' });
  }
};

