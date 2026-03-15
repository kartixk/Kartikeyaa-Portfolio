import ContactMessage from '../models/ContactMessage.js';
import nodemailer from 'nodemailer';

export const handleContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Name, email, and message are required.' });
    }

    let docId = null;
    if (process.env.MONGODB_URI) {
      try {
        const doc = await ContactMessage.create({ name, email, phone, message });
        docId = doc._id;
      } catch (dbError) {
        console.warn('Failed to save contact message to database, proceeding with email anyway:', dbError.message);
      }
    } else {
      console.warn('MONGODB_URI is not set. Skipping database persistence.');
    }

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.CONTACT_RECIPIENT) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        // Force secure to true if using port 465, otherwise use the env variable
        secure: Number(process.env.SMTP_PORT) === 465 ? true : Boolean(process.env.SMTP_SECURE === 'true'),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        // Adding TLS options helps prevent connection issues in some environments
        tls: {
          rejectUnauthorized: false
        }
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
        subject: `Thanks for reaching out, `,
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
<body style="margin:0;padding:0;background:#f8fafc;font-family:'DM Sans',Helvetica,Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 16px 48px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;margin:0 auto;background:#ffffff;border-radius:12px;box-shadow:0 4px 20px -2px rgba(0,0,0,0.05);overflow:hidden;">

  <!-- Thin top accent line -->
  <tr>
    <td style="height:3px;background:linear-gradient(90deg,transparent 0%,#6d28d9 30%,#06b6d4 70%,transparent 100%);"></td>
  </tr>

  <!-- HEADER BLOCK -->
  <tr>
    <td style="padding:48px 40px 40px;text-align:center;">

      <!-- Monogram -->
      <table cellpadding="0" cellspacing="0" style="margin:0 auto 24px;">
        <tr>
          <td style="width:64px;height:64px;text-align:center;vertical-align:middle;position:relative;">
            <!-- Outer ring -->
            <div style="width:64px;height:64px;border-radius:50%;border:1px solid rgba(109,40,217,0.2);display:inline-block;text-align:center;line-height:64px;">
              <!-- Inner circle -->
              <div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(145deg,#f1f5f9 0%,#e2e8f0 100%);margin:7px auto 0;border:1px solid rgba(6,182,212,0.2);text-align:center;line-height:48px;">
                <span style="font-family:'DM Serif Display',Georgia,serif;font-size:22px;color:#1e293b;letter-spacing:-0.5px;">K</span>
              </div>
            </div>
          </td>
        </tr>
      </table>

      <!-- Name wordmark -->
      <p style="margin:0 0 8px;font-family:'DM Sans',sans-serif;font-size:10px;font-weight:600;letter-spacing:5px;text-transform:uppercase;color:#64748b;">B · Venkata Sai Kartikeya</p>
      <h1 style="margin:0;font-family:'DM Serif Display',Georgia,serif;font-size:34px;font-weight:400;color:#0f172a;letter-spacing:-1px;line-height:1.2;">Your message<br><em style="color:#6d28d9;font-style:italic;">has arrived.</em></h1>
    </td>
  </tr>

  <!-- Hairline separator -->
  <tr>
    <td style="height:1px;">
      <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(139,92,246,0.1),rgba(6,182,212,0.1),transparent);"></div>
    </td>
  </tr>

  <!-- BODY BLOCK -->
  <tr>
    <td style="padding:40px 48px 32px;">

      <!-- Greeting -->
      <p style="margin:0 0 6px;font-size:13px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#64748b;">Hello,</p>
      <p style="margin:0 0 16px;font-family:'DM Serif Display',Georgia,serif;font-size:24px;font-weight:400;color:#0f172a;line-height:1.2;">${name}</p>

      <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#475569;font-weight:400;">
        Thank you for taking the time to reach out. Your message has been safely delivered to my inbox — I've read every word, and I genuinely appreciate you connecting with me.
      </p>

      <!-- Response time strip -->
      <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:28px;">
        <tr>
          <td style="background:#f8fafc;border:1px solid rgba(139,92,246,0.1);border-radius:8px;padding:0;">
            <table cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <!-- Left accent bar -->
                <td style="width:4px;background:linear-gradient(180deg,#6d28d9,#06b6d4);border-radius:8px 0 0 8px;">&nbsp;</td>
                <td style="padding:16px 20px;">
                  <p style="margin:0 0 3px;font-size:10px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:#64748b;">Response Window</p>
                  <p style="margin:0;font-family:'DM Serif Display',Georgia,serif;font-size:20px;color:#334155;font-weight:400;">24 – 48 hours</p>
                </td>
                <td style="padding-right:20px;text-align:right;vertical-align:middle;">
                  <span style="font-size:24px;opacity:0.2;color:#64748b;">◷</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- Quote block -->
      <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:32px;">
        <tr>
          <td style="padding:16px 20px 16px 24px;background:rgba(109,40,217,0.03);border-left:3px solid #6d28d9;border-radius:0 8px 8px 0;">
            <p style="margin:0 0 8px;font-family:'DM Serif Display',Georgia,serif;font-size:16px;font-style:italic;color:#6d28d9;line-height:1.6;">"The details are not the details.<br>They make the design."</p>
            <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#64748b;">— Charles Eames</p>
          </td>
        </tr>
      </table>

      <p style="margin:0;font-size:14px;line-height:1.7;color:#475569;font-weight:400;">
        While you wait, explore my work on
        <a href="https://github.com/kartixk" style="color:#06b6d4;text-decoration:none;font-weight:500;border-bottom:1px solid rgba(6,182,212,0.3);">GitHub</a>
        &nbsp;or browse the
        <a href="https://kartikeyaa-portfolio.vercel.app" style="color:#06b6d4;text-decoration:none;font-weight:500;border-bottom:1px solid rgba(6,182,212,0.3);">portfolio</a>.
        Looking forward to a great conversation.
      </p>
    </td>
  </tr>

  <!-- DIVIDER -->
  <tr>
    <td style="padding:0 48px;">
      <div style="height:1px;background:rgba(0,0,0,0.05);"></div>
    </td>
  </tr>

  <!-- SIGNATURE BLOCK -->
  <tr>
    <td style="padding:28px 48px 36px;">
      <table cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td>
            <p style="margin:0 0 2px;font-family:'DM Serif Display',Georgia,serif;font-size:18px;font-weight:400;color:#0f172a;">B Venkata Sai Kartikeya</p>
            <p style="margin:0 0 10px;font-size:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#64748b;">Full-Stack Developer · MERN &amp; IoT</p>
            <p style="margin:0;font-size:12px;color:#475569;font-weight:400;">Visakhapatnam, India &nbsp;&nbsp;·&nbsp;&nbsp; kartikeyaa15@gmail.com</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Bottom accent line -->
  <tr>
    <td style="height:3px;background:linear-gradient(90deg,transparent 0%,#6d28d9 30%,#06b6d4 70%,transparent 100%);"></td>
  </tr>

</table>

<!-- Footer -->
<table cellpadding="0" cellspacing="0" width="100%">
  <tr>
    <td style="padding:20px 16px 0;text-align:center;">
      <p style="margin:0;font-size:11px;font-weight:400;letter-spacing:0.5px;color:#94a3b8;">Automated confirmation · No reply necessary</p>
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

