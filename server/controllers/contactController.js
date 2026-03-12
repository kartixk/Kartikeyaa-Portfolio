import ContactMessage from '../models/ContactMessage.js';
import nodemailer from 'nodemailer';

export const handleContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Name, email, and message are required.' });
    }

    // Step 1: Try to save to MongoDB (non-blocking failure)
    let savedToDb = false;
    try {
      await ContactMessage.create({ name, email, phone, message });
      savedToDb = true;
    } catch (dbError) {
      console.error('MongoDB save failed (continuing):', dbError.message);
    }

    // Step 2: Try to send email (non-blocking failure)
    let emailSent = false;
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.CONTACT_RECIPIENT) {
      try {
        const transporter = nodemailer.createTransport(
          process.env.SMTP_HOST && process.env.SMTP_HOST.includes('gmail.com')
            ? {
              host: 'smtp.gmail.com',
              port: 465,
              secure: true,
              auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
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
        emailSent = true;
      } catch (emailError) {
        console.error('Email sending failed (continuing):', emailError.message);
      }
    } else {
      console.warn('SMTP env variables not configured. Skipping email.');
    }

    console.log(`Contact form: savedToDb=${savedToDb}, emailSent=${emailSent}`);

    if (!savedToDb && !emailSent) {
      return res.status(500).json({ success: false, error: 'Server is not fully configured yet. Please contact me directly at kartikeyaa15@gmail.com' });
    }

    return res.status(201).json({ success: true, data: { savedToDb, emailSent } });
  } catch (error) {
    console.error('Error handling contact message', error);
    return res.status(500).json({ success: false, error: 'Failed to submit message. Please try again later.' });
  }
};


