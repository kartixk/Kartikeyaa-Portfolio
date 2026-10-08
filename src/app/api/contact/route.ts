import { NextResponse, type NextRequest } from 'next/server';
import { Resend } from 'resend';
import { getSupabaseAdmin } from '@/lib/supabase';
import {
  autoReplyHtml,
  formatIstTimestamp,
  ownerEmailHtml,
  ownerEmailText,
  type ContactPayload,
} from '@/lib/contact-email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMAIL_TIMEOUT_MS = 15000;

/* ── best-effort per-instance rate limit (5 requests / minute / IP) ── */
const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_HITS = 5;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 500) {
    for (const [key, times] of hits) if (!times.some((t) => now - t < WINDOW_MS)) hits.delete(key);
  }
  return recent.length > MAX_HITS;
}

const fail = (error: string, status: number) => NextResponse.json({ success: false, error }, { status });

const parseRecipients = (...raw: Array<string | undefined>) =>
  raw
    .filter(Boolean)
    .flatMap((value) => String(value).split(','))
    .map((value) => value.trim())
    .filter((value) => EMAIL_RE.test(value));

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
    promise.then(
      (value) => { clearTimeout(timer); resolve(value); },
      (error) => { clearTimeout(timer); reject(error); }
    );
  });
}

async function sendWithRetry<T>(fn: () => Promise<T>, label: string, retries = 1): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await withTimeout(fn(), EMAIL_TIMEOUT_MS, label);
    } catch (error) {
      lastError = error;
      if (attempt < retries) console.warn(`${label} failed (attempt ${attempt + 1}), retrying…`, (error as Error)?.message);
    }
  }
  throw lastError;
}

function clean(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (rateLimited(ip)) return fail('Too many requests. Please wait a minute and try again.', 429);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return fail('Invalid request body.', 400);
  }

  // honeypot: silently accept bots without doing any work
  if (clean(body.website, 200)) return NextResponse.json({ success: true, data: { id: null } }, { status: 201 });

  const payload: ContactPayload = {
    name: clean(body.name, 120),
    email: clean(body.email, 200),
    phone: clean(body.phone, 40) || undefined,
    message: clean(body.message, 5000),
  };

  if (!payload.name || !payload.email || !payload.message) return fail('Name, email, and message are required.', 400);
  if (!EMAIL_RE.test(payload.email)) return fail('Please provide a valid email address.', 400);

  try {
    // 1. persist (optional — never blocks delivery)
    let docId: string | null = null;
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from('contact_messages')
        .insert({ name: payload.name, email: payload.email, phone: payload.phone ?? null, message: payload.message })
        .select('id')
        .single();
      if (error) console.warn('Contact message not saved to Supabase:', error.message);
      else docId = data.id;
    }

    // 2. email
    const recipients = parseRecipients(
      process.env.CONTACT_RECIPIENT,
      process.env.CONTACT_RECIPIENTS,
      process.env.OWNER_EMAIL,
      process.env.CONTACT_EMAIL
    );
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey || recipients.length === 0) {
      if (docId) {
        console.warn('Contact saved, but email is not configured (RESEND_API_KEY + CONTACT_RECIPIENT).');
        return NextResponse.json({ success: true, data: { id: docId } }, { status: 201 });
      }
      console.error('Contact email is not configured. Set RESEND_API_KEY and CONTACT_RECIPIENT.');
      return fail('Email service is currently unavailable. Please email me directly.', 503);
    }

    const resend = new Resend(apiKey);
    const from = process.env.RESEND_FROM || 'Portfolio Contact <onboarding@resend.dev>';
    const submittedAt = formatIstTimestamp();

    const send = async (args: Parameters<typeof resend.emails.send>[0]) => {
      const result = await resend.emails.send(args);
      if (result.error) throw new Error(result.error.message || 'Resend send failed');
      return result;
    };

    const [owner, reply] = await Promise.allSettled([
      sendWithRetry(
        () =>
          send({
            from,
            to: recipients,
            replyTo: payload.email,
            subject: `New portfolio contact: ${payload.name} (${payload.email})`,
            text: ownerEmailText(payload, submittedAt),
            html: ownerEmailHtml(payload, submittedAt),
          }),
        'Owner notification'
      ),
      sendWithRetry(
        () => send({ from, to: payload.email, subject: 'Thanks for reaching out', html: autoReplyHtml(payload) }),
        'Auto-reply'
      ),
    ]);

    if (reply.status === 'rejected') console.warn('Auto-reply failed:', (reply.reason as Error)?.message);

    if (owner.status === 'rejected') {
      console.error('Owner notification failed:', (owner.reason as Error)?.message);
      // the message is stored — still a success from the visitor's point of view
      if (docId) return NextResponse.json({ success: true, data: { id: docId } }, { status: 201 });
      return fail('Could not deliver your message right now. Please try again shortly.', 502);
    }

    return NextResponse.json({ success: true, data: { id: docId } }, { status: 201 });
  } catch (error) {
    console.error('Error handling contact message', error);
    return fail('Failed to submit message. Please try again later.', 500);
  }
}

export function GET() {
  return NextResponse.json({ status: 'ok' });
}
