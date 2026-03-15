import ContactMessage from '../models/ContactMessage.js';
import { Resend } from 'resend';

const withTimeout = (promise, timeoutMs, label) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`${label} timed out after ${timeoutMs}ms`)), timeoutMs);
    }),
  ]);
};

const sendResendEmail = async (client, payload) => {
  const result = await client.emails.send(payload);
  if (result?.error) {
    throw new Error(result.error.message || 'Resend email send failed');
  }
  return result;
};

const parseRecipients = (...rawValues) => {
  return rawValues
    .filter(Boolean)
    .flatMap((value) => String(value).split(','))
    .map((value) => value.trim())
    .filter((value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
};

const sendWithRetry = async (sendFn, retries = 1, label = 'Email send') => {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await sendFn();
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        console.warn(`${label} failed on attempt ${attempt + 1}, retrying...`, error?.message || error);
      }
    }
  }

  throw lastError;
};

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const formatIstTimestamp = (date = new Date()) => {
  const formatted = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(date);

  return `${formatted} IST (UTC+05:30)`;
};

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

    const ownerRecipients = parseRecipients(
      process.env.CONTACT_RECIPIENT,
      process.env.CONTACT_RECIPIENTS,
      process.env.OWNER_EMAIL,
      process.env.CONTACT_EMAIL,
    );
    const fromAddress = process.env.RESEND_FROM || 'Portfolio Contact <onboarding@resend.dev>';
    const resendConfigured = Boolean(process.env.RESEND_API_KEY) && ownerRecipients.length > 0;

    if (resendConfigured) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const submittedAt = formatIstTimestamp(new Date());

      const ownerTextBody = [
        'NEW PORTFOLIO CONTACT SUBMISSION',
        '',
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || 'Not provided'}`,
        `Submitted At (IST): ${submittedAt}`,
        
        '',
        'Message:',
        message,
      ].join('\n');

      const ownerHtmlBody = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>New Portfolio Contact</title>
</head>
<body style="margin:0;padding:24px;background:#f5f7fb;font-family:Segoe UI,Arial,sans-serif;color:#111827;">
  <table cellpadding="0" cellspacing="0" width="100%" style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
    <tr>
      <td style="padding:18px 22px;background:#0f172a;color:#f8fafc;font-size:18px;font-weight:600;">New portfolio contact submission</td>
    </tr>
    <tr>
      <td style="padding:20px 22px;">
        <table cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
          <tr><td style="padding:8px 0;color:#6b7280;width:170px;">Name</td><td style="padding:8px 0;font-weight:600;">${escapeHtml(name)}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;">Email</td><td style="padding:8px 0;"><a href="mailto:${escapeHtml(email)}" style="color:#0ea5e9;text-decoration:none;">${escapeHtml(email)}</a></td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;">Phone</td><td style="padding:8px 0;">${escapeHtml(phone || 'Not provided')}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;">Submitted (IST)</td><td style="padding:8px 0;">${escapeHtml(submittedAt)}</td></tr>
        </table>
        <div style="margin-top:16px;padding:14px;border:1px solid #e5e7eb;background:#f9fafb;border-radius:8px;">
          <div style="font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#6b7280;margin-bottom:8px;">Message</div>
          <pre style="white-space:pre-wrap;word-break:break-word;margin:0;font:14px/1.6 Segoe UI,Arial,sans-serif;color:#111827;">${escapeHtml(message)}</pre>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;

      const mailToOwner = sendWithRetry(
        () => sendResendEmail(resend, {
          from: fromAddress,
          to: ownerRecipients,
          replyTo: email,
          subject: `New portfolio contact: ${name} (${email})`,
          text: ownerTextBody,
          html: ownerHtmlBody,
        }),
        1,
        'Owner notification send',
      );

      const autoReply = sendResendEmail(resend, {
        from: fromAddress,
        to: email,
        subject: 'Thanks for reaching out',
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

  <tr>
    <td style="height:3px;background:linear-gradient(90deg,transparent 0%,#6d28d9 30%,#06b6d4 70%,transparent 100%);"></td>
  </tr>

  <tr>
    <td style="padding:48px 40px 40px;text-align:center;">
      <table cellpadding="0" cellspacing="0" style="margin:0 auto 24px;">
        <tr>
          <td style="width:64px;height:64px;text-align:center;vertical-align:middle;position:relative;">
            <div style="width:64px;height:64px;border-radius:50%;border:1px solid rgba(109,40,217,0.2);display:inline-block;text-align:center;line-height:64px;">
              <div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(145deg,#f1f5f9 0%,#e2e8f0 100%);margin:7px auto 0;border:1px solid rgba(6,182,212,0.2);text-align:center;line-height:48px;">
                <span style="font-family:'DM Serif Display',Georgia,serif;font-size:22px;color:#1e293b;letter-spacing:-0.5px;">K</span>
              </div>
            </div>
          </td>
        </tr>
      </table>

      <p style="margin:0 0 8px;font-family:'DM Sans',sans-serif;font-size:10px;font-weight:600;letter-spacing:5px;text-transform:uppercase;color:#64748b;">B · Venkata Sai Kartikeya</p>
      <h1 style="margin:0;font-family:'DM Serif Display',Georgia,serif;font-size:34px;font-weight:400;color:#0f172a;letter-spacing:-1px;line-height:1.2;">Your message<br><em style="color:#6d28d9;font-style:italic;">has arrived.</em></h1>
    </td>
  </tr>

  <tr>
    <td style="height:1px;">
      <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(139,92,246,0.1),rgba(6,182,212,0.1),transparent);"></div>
    </td>
  </tr>

  <tr>
    <td style="padding:40px 48px 32px;">
      <p style="margin:0 0 6px;font-size:13px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#64748b;">Hello,</p>
      <p style="margin:0 0 16px;font-family:'DM Serif Display',Georgia,serif;font-size:24px;font-weight:400;color:#0f172a;line-height:1.2;">${name}</p>

      <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#475569;font-weight:400;">
        Thank you for taking the time to reach out. Your message has been safely delivered to my inbox — I've read every word, and I genuinely appreciate you connecting with me.
      </p>

      <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:32px;">
        <tr>
          <td style="background:#f8fafc;border:1px solid rgba(139,92,246,0.1);border-radius:8px;padding:0;">
            <table cellpadding="0" cellspacing="0" width="100%">
              <tr>
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

      <p style="margin:0;font-size:14px;line-height:1.7;color:#475569;font-weight:400;">
        While you wait, explore my work on
        <a href="https://github.com/kartixk" style="color:#06b6d4;text-decoration:none;font-weight:500;border-bottom:1px solid rgba(6,182,212,0.3);">GitHub</a>
        &nbsp;or browse the
        <a href="https://kartikeyaa-portfolio.vercel.app" style="color:#06b6d4;text-decoration:none;font-weight:500;border-bottom:1px solid rgba(6,182,212,0.3);">portfolio</a>.
        Looking forward to a great conversation.
      </p>
    </td>
  </tr>

  <tr>
    <td style="padding:0 48px;">
      <div style="height:1px;background:rgba(0,0,0,0.05);"></div>
    </td>
  </tr>

  <tr>
    <td style="padding:28px 48px 36px;">
      <table cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td>
            <p style="margin:0 0 2px;font-family:'DM Serif Display',Georgia,serif;font-size:18px;font-weight:400;color:#0f172a;">B Venkata Sai Kartikeya</p>
            <p style="margin:0 0 10px;font-size:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#64748b;">Full-Stack Developer ·</p>
            <p style="margin:0;font-size:12px;color:#475569;font-weight:400;">Visakhapatnam, India &nbsp;&nbsp;·&nbsp;&nbsp; kartikeyaa15@gmail.com</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <tr>
    <td style="height:3px;background:linear-gradient(90deg,transparent 0%,#6d28d9 30%,#06b6d4 70%,transparent 100%);"></td>
  </tr>

</table>

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
</html>`,
      });

      const emailResults = await Promise.allSettled([
        withTimeout(mailToOwner, 12000, 'Owner email send (Resend)'),
        withTimeout(autoReply, 12000, 'Auto-reply send (Resend)'),
      ]);

      const hasEmailFailure = emailResults.some((result) => result.status === 'rejected');

      emailResults.forEach((result, index) => {
        if (result.status === 'rejected') {
          const target = index === 0 ? 'owner notification' : 'auto-reply';
          console.warn(`Contact email warning (${target}):`, result.reason?.message || result.reason);
        }
      });

      if (hasEmailFailure) {
        return res.status(502).json({
          success: false,
          error: 'Message received but email delivery failed. Please try again later.',
          data: { id: docId },
        });
      }

      return res.status(201).json({ success: true, data: { id: docId } });
    }

    console.error('Contact email is not configured. Set RESEND_API_KEY + CONTACT_RECIPIENT (or CONTACT_RECIPIENTS/OWNER_EMAIL).');
    return res.status(503).json({
      success: false,
      error: 'Email service is currently unavailable. Please try again later.',
    });
  } catch (error) {
    console.error('Error handling contact message', error);
    return res.status(500).json({ success: false, error: 'Failed to submit message. Please try again later.' });
  }
};

