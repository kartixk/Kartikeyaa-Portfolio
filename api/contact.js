import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS.replace(/\s+/g, ''), // strip spaces from App Password
      },
    });

    // Notification to you
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_RECIPIENT,
      subject: `New Portfolio Contact: ${name}`,
      text: `You have a new contact form submission:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\n\nMessage:\n${message}`,
    });

    // Auto-reply to sender
    await transporter.sendMail({
      from: `"B Venkata Sai Kartikeya" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Re: Thank you for reaching out!`,
      html: `
        <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; color: #1a1a1a; max-width: 600px; line-height: 1.6;">
          <h2 style="color: #00e5ff;">Hello ${name},</h2>
          <p>Thank you for reaching out! I've received your message and appreciate you taking the time to connect.</p>
          <p>I usually respond within <strong>24-48 hours</strong>.</p>
          <div style="margin: 30px 0; padding: 20px; border-left: 4px solid #00e5ff; background-color: #f9f9f9;">
            <p style="margin: 0; font-style: italic; color: #555;">"Design is not just what it looks like and feels like. Design is how it works."</p>
          </div>
          <p>Looking forward to a great conversation!</p>
          <br />
          <p style="margin-bottom: 0;">Best regards,</p>
          <p style="margin-top: 5px;"><strong>B Venkata Sai Kartikeya</strong><br />
          <span style="color: #666; font-size: 0.9em;">Full-Stack Developer | MERN & IoT Specialist</span></p>
        </div>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Contact email error:', error);
    return res.status(500).json({ error: 'Failed to send email. Please try again.' });
  }
}
