import ContactMessage from '../models/ContactMessage.js';
import nodemailer from 'nodemailer';

export const handleContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Name, email, and message are required.' });
    }

    const doc = await ContactMessage.create({ name, email, phone, message });

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.CONTACT_RECIPIENT) {
      const transporter = nodemailer.createTransport(
        process.env.SMTP_HOST && process.env.SMTP_HOST.includes('gmail.com')
          ? {
            service: 'gmail',
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS.replace(/\s+/g, ''), // Strip spaces from App Password just in case!
            },
          }
          : {
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: Boolean(process.env.SMTP_SECURE === 'true'),
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          }
      );
      //SS
      // 1. Notification to Admin (Kartikeya)
      await transporter.sendMail({
        from: `"Portfolio Notification" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: process.env.CONTACT_RECIPIENT,
        subject: `New Portfolio Contact: ${name}`,
        text: `You have a new contact form submission:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\n\nMessage:\n${message}`,
      });

      // 2. Auto-reply to the User
      await transporter.sendMail({
        from: `"B Venkata Sai Kartikeya" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: email,
        subject: `Re: Thank you for reaching out!`,
        html: `
          <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; color: #1a1a1a; max-width: 600px; line-height: 1.6;">
            <h2 style="color: #00e5ff;">Hello ${name},</h2>
            <p>Thank you for reaching out! I've received your message and appreciate you taking the time to connect.</p>
            
            <p>I usually respond within <strong>24-48 hours</strong>. In the meantime, feel free to check out some of my latest projects or my GitHub profile if you haven't already.</p>
            
            <div style="margin: 30px 0; padding: 20px; border-left: 4px solid #00e5ff; background-color: #f9f9f9;">
              <p style="margin: 0; font-style: italic; color: #555;">"Design is not just what it looks like and feels like. Design is how it works."</p>
            </div>

            <p>Looking forward to a great conversation!</p>
            
            <br />
            <p style="margin-bottom: 0;">Best regards,</p>
            <p style="margin-top: 5px;"><strong>B Venkata Sai Kartikeya</strong><br />
            <span style="color: #666; font-size: 0.9em;">Full-Stack Developer | MERN & IoT Specialist</span></p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 0.8em; color: #999;">This is an automated confirmation. No need to reply to this email.</p>
          </div>
        `,
      });
    }

    return res.status(201).json({ success: true, data: { id: doc._id } });
  } catch (error) {
    console.error('Error handling contact message', error);
    return res.status(500).json({ success: false, error: 'Failed to submit message. Please try again later.' });
  }
};

