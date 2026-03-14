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

      // Premium auto-reply to sender
      await transporter.sendMail({
        from: `"B Venkata Sai Kartikeya" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: email,
        subject: `Thanks for reaching out, ${name}!`,
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Message Received</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
  </style>
</head>
<body style="margin:0;padding:0;background:#050509;font-family:'DM Sans',Helvetica,Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#050509;padding:56px 16px 64px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <!-- Thin top accent line -->
  <tr>
    <td style="height:1px;background:linear-gradient(90deg,transparent 0%,#6d28d9 30%,#06b6d4 70%,transparent 100%);"></td>
  </tr>

  <!-- HEADER BLOCK -->
  <tr>
    <td style="background:#0a0a14;padding:60px 56px 52px;text-align:center;border-left:1px solid rgba(255,255,255,0.04);border-right:1px solid rgba(255,255,255,0.04);">

      <!-- Monogram -->
      <table cellpadding="0" cellspacing="0" style="margin:0 auto 36px;">
        <tr>
          <td style="width:64px;height:64px;text-align:center;vertical-align:middle;position:relative;">
            <!-- Outer ring -->
            <div style="width:64px;height:64px;border-radius:50%;border:1px solid rgba(109,40,217,0.4);display:inline-block;text-align:center;line-height:64px;">
              <!-- Inner circle -->
              <div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(145deg,#1a0533 0%,#0c1a2e 100%);margin:7px auto 0;border:1px solid rgba(6,182,212,0.2);text-align:center;line-height:48px;">
                <span style="font-family:'DM Serif Display',Georgia,serif;font-size:22px;color:#e2d9f3;letter-spacing:-0.5px;">K</span>
              </div>
            </div>
          </td>
        </tr>
      </table>

      <!-- Name wordmark -->
      <p style="margin:0 0 10px;font-family:'DM Sans',sans-serif;font-size:10px;font-weight:400;letter-spacing:5px;text-transform:uppercase;color:#4b5a6e;">B · Venkata Sai Kartikeya</p>
      <h1 style="margin:0;font-family:'DM Serif Display',Georgia,serif;font-size:38px;font-weight:400;color:#f0ebff;letter-spacing:-1px;line-height:1.1;">Your message<br><em style="color:#8b5cf6;font-style:italic;">has arrived.</em></h1>
    </td>
  </tr>

  <!-- Hairline separator -->
  <tr>
    <td style="background:#0e0e1a;height:1px;border-left:1px solid rgba(255,255,255,0.04);border-right:1px solid rgba(255,255,255,0.04);">
      <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(139,92,246,0.2),rgba(6,182,212,0.2),transparent);"></div>
    </td>
  </tr>

  <!-- BODY BLOCK -->
  <tr>
    <td style="background:#0e0e1a;padding:48px 56px 40px;border-left:1px solid rgba(255,255,255,0.04);border-right:1px solid rgba(255,255,255,0.04);">

      <!-- Greeting -->
      <p style="margin:0 0 6px;font-size:13px;font-weight:400;letter-spacing:2px;text-transform:uppercase;color:#4b5a6e;">Hello,</p>
      <p style="margin:0 0 28px;font-family:'DM Serif Display',Georgia,serif;font-size:28px;font-weight:400;color:#e8e2f8;line-height:1.2;">${name}</p>

      <p style="margin:0 0 36px;font-size:15px;line-height:1.85;color:#7a8899;font-weight:300;">
        Thank you for taking the time to reach out. Your message has been safely delivered to my inbox — I've read every word, and I genuinely appreciate you connecting with me.
      </p>

      <!-- Response time strip -->
      <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:36px;">
        <tr>
          <td style="background:#0a0a14;border:1px solid rgba(139,92,246,0.15);border-radius:4px;padding:0;">
            <table cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <!-- Left accent bar -->
                <td style="width:3px;background:linear-gradient(180deg,#6d28d9,#06b6d4);border-radius:4px 0 0 4px;">&nbsp;</td>
                <td style="padding:20px 24px;">
                  <p style="margin:0 0 3px;font-size:10px;font-weight:500;letter-spacing:3px;text-transform:uppercase;color:#3d4f63;">Response Window</p>
                  <p style="margin:0;font-family:'DM Serif Display',Georgia,serif;font-size:24px;color:#d4c8f0;font-weight:400;">24 – 48 hours</p>
                </td>
                <td style="padding-right:24px;text-align:right;vertical-align:middle;">
                  <span style="font-size:28px;opacity:0.4;">◷</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- Quote block -->
      <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:36px;">
        <tr>
          <td style="padding:20px 24px 20px 28px;background:rgba(109,40,217,0.06);border-left:2px solid #6d28d9;border-radius:0 4px 4px 0;">
            <p style="margin:0 0 8px;font-family:'DM Serif Display',Georgia,serif;font-size:17px;font-style:italic;color:#a78bda;line-height:1.7;">"The details are not the details.<br>They make the design."</p>
            <p style="margin:0;font-size:11px;font-weight:500;letter-spacing:2px;text-transform:uppercase;color:#3d4f63;">— Charles Eames</p>
          </td>
        </tr>
      </table>

      <p style="margin:0;font-size:14px;line-height:1.9;color:#4b5a6e;font-weight:300;">
        While you wait, explore my work on
        <a href="https://github.com/kartixk" style="color:#06b6d4;text-decoration:none;font-weight:400;border-bottom:1px solid rgba(6,182,212,0.3);">GitHub</a>
        &nbsp;or browse the
        <a href="https://kartikeyaa-portfolio.vercel.app" style="color:#06b6d4;text-decoration:none;font-weight:400;border-bottom:1px solid rgba(6,182,212,0.3);">portfolio</a>.
        Looking forward to a great conversation.
      </p>
    </td>
  </tr>

  <!-- DIVIDER -->
  <tr>
    <td style="background:#0e0e1a;padding:0 56px;border-left:1px solid rgba(255,255,255,0.04);border-right:1px solid rgba(255,255,255,0.04);">
      <div style="height:1px;background:rgba(255,255,255,0.05);"></div>
    </td>
  </tr>

  <!-- SIGNATURE BLOCK -->
  <tr>
    <td style="background:#0e0e1a;padding:32px 56px 44px;border-left:1px solid rgba(255,255,255,0.04);border-right:1px solid rgba(255,255,255,0.04);">
      <table cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td>
            <p style="margin:0 0 2px;font-family:'DM Serif Display',Georgia,serif;font-size:18px;font-weight:400;color:#d4c8f0;">B Venkata Sai Kartikeya</p>
            <p style="margin:0 0 12px;font-size:11px;font-weight:400;letter-spacing:2.5px;text-transform:uppercase;color:#3d4f63;">Full-Stack Developer · MERN &amp; IoT</p>
            <p style="margin:0;font-size:12px;color:#2a3a4a;font-weight:300;">Visakhapatnam, India &nbsp;&nbsp;·&nbsp;&nbsp; kartikeyaa15@gmail.com</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Bottom accent line -->
  <tr>
    <td style="height:1px;background:linear-gradient(90deg,transparent 0%,#6d28d9 30%,#06b6d4 70%,transparent 100%);"></td>
  </tr>

  <!-- Footer -->
  <tr>
    <td style="padding:18px 56px 0;text-align:center;">
      <p style="margin:0;font-size:11px;font-weight:300;letter-spacing:0.5px;color:#1e2d3d;">Automated confirmation · No reply necessary</p>
    </td>
  </tr>

</table>
</td></tr>
</table>

</body>
</html>`
      });
    }

    return res.status(201).json({ success: true, data: { id: docId } });
  } catch (error) {
    console.error('Error handling contact message', error);
    return res.status(500).json({ success: false, error: 'Failed to submit message. Please try again later.' });
  }
};

