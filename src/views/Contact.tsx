'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Check, Copy, Send } from 'lucide-react';
import { toast } from 'sonner';
import PageTransition from '@/components/PageTransition';
import PageHeader from '@/components/PageHeader';
import LocalTime from '@/components/LocalTime';
import { Magnetic, Reveal } from '@/components/fx';
import { PHONE } from '@/lib/data';
import { SITE } from '@/lib/site';

const fetchWithTimeout = async (url: string, options: RequestInit, timeoutMs = 20000) => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    window.clearTimeout(timeoutId);
  }
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const links = [
  { label: 'Phone', value: PHONE, href: 'tel:+918250977949' },
  { label: 'GitHub', value: 'github.com/kartixk', href: SITE.github, external: true },
  { label: 'LinkedIn', value: 'b-venkata-sai-kartikeya', href: SITE.linkedin, external: true },
];

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const openedAt = useRef(0); // bot check: humans take more than a moment to fill the form
  useEffect(() => { openedAt.current = Date.now(); }, []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email);
      setCopied(true);
      toast.success('Email copied to clipboard');
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${SITE.email}`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetchWithTimeout('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), phone: phone.trim() || undefined, message: message.trim(), elapsedMs: Date.now() - openedAt.current }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || `Failed to send (${response.status})`);
      }
      setSentTo(name.trim().split(' ')[0]);
      setName(''); setEmail(''); setPhone(''); setMessage('');
    } catch (error) {
      toast.error(
        error instanceof DOMException && error.name === 'AbortError'
          ? 'Request timed out. Please try again.'
          : error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <PageHeader
        index="06"
        eyebrow="Contact"
        lines={[<span key="a">Let&apos;s build</span>, <span key="b" className="serif text-gradient">something great</span>]}
        subtitle="Always open to new opportunities, collaborations and interesting conversations. Drop me a message — I'll get back within 24 hours."
        meta={<span className="inline-flex items-center gap-2"><span className="h-1.5 w-1.5 animate-blink rounded-full bg-primary" /> Available now</span>}
      />

      <section className="wrap pb-24 md:pb-40">
        <div className="grid gap-16 lg:grid-cols-[5fr_7fr] lg:gap-24">
          {/* details */}
          <Reveal>
            <p className="eyebrow mb-6">Write to</p>
            <button
              onClick={copyEmail}
              data-cursor={copied ? 'Copied' : 'Copy'}
              className="group display flex w-full items-start justify-between gap-4 break-all text-left text-[clamp(1.5rem,2.7vw,2.5rem)] leading-[1.1]"
            >
              <span className="transition-colors group-hover:text-primary">{SITE.email}</span>
              <span className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line/25 transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </span>
            </button>

            <ul className="mt-14 border-b border-line/15">
              {links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target={l.external ? '_blank' : undefined}
                    rel={l.external ? 'noopener noreferrer' : undefined}
                    className="group flex items-center justify-between gap-4 border-t border-line/15 py-5"
                  >
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{l.label}</span>
                    <span className="flex items-center gap-2 text-lg font-medium transition-colors group-hover:text-primary">
                      {l.value}
                      <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </a>
                </li>
              ))}
              <li className="flex items-center justify-between gap-4 border-t border-line/15 py-5">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Location</span>
                <span className="text-lg font-medium">
                  Visakhapatnam, IN · <LocalTime className="font-mono text-base text-muted-foreground" />
                </span>
              </li>
            </ul>

            <p className="mt-10 max-w-sm text-base leading-relaxed text-muted-foreground">
              Open to full-time roles, internships and freelance projects. Response time is typically within 24 hours.
            </p>
          </Reveal>

          {/* form */}
          <Reveal delay={0.1}>
            <AnimatePresence mode="wait" initial={false}>
              {sentTo ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="flex min-h-[420px] flex-col justify-between rounded-3xl bg-grad-pan p-8 text-[#120d24] md:p-12"
                  role="status"
                >
                  <motion.span
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.2 }}
                    className="grid h-16 w-16 place-items-center rounded-full bg-[#120d24] text-white"
                  >
                    <Check size={30} strokeWidth={2.5} />
                  </motion.span>
                  <div>
                    <p className="display text-[clamp(2.6rem,6vw,5.5rem)]">
                      Thanks, <span className="serif">{sentTo}.</span>
                    </p>
                    <p className="mt-4 max-w-md text-lg leading-snug opacity-80">Your message is in. I&apos;ll get back to you soon — check your inbox for a confirmation.</p>
                    <button onClick={() => { openedAt.current = Date.now(); setSentTo(null); }} className="link-u mt-8 font-semibold">
                      Send another message →
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  noValidate
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-9"
                >
                  <div>
                    <label htmlFor="contact-name" className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                      01 — Name <span className="text-primary">*</span>
                    </label>
                    <input id="contact-name" name="name" autoComplete="name" maxLength={120} type="text" value={name} onChange={(e) => setName(e.target.value)} className="field" placeholder="Your full name" />
                  </div>
                  <div className="grid gap-9 sm:grid-cols-2">
                    <div>
                      <label htmlFor="contact-email" className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                        02 — Email <span className="text-primary">*</span>
                      </label>
                      <input id="contact-email" name="email" autoComplete="email" maxLength={200} type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field" placeholder="you@email.com" />
                    </div>
                    <div>
                      <label htmlFor="contact-phone" className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                        03 — Phone <span className="normal-case tracking-normal opacity-60">(optional)</span>
                      </label>
                      <input id="contact-phone" name="phone" autoComplete="tel" maxLength={40} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="field" placeholder="+91 XXXXX XXXXX" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                      04 — Message <span className="text-primary">*</span>
                    </label>
                    <textarea id="contact-message" name="message" maxLength={5000} rows={4} value={message} onChange={(e) => setMessage(e.target.value)} className="field resize-none" placeholder="Tell me about your project, idea, or just say hello…" />
                  </div>

                  <div className="flex items-center justify-between gap-6 pt-2">
                    <p className="hidden max-w-[16rem] text-sm text-muted-foreground sm:block">I reply to every message personally.</p>
                    <Magnetic strength={0.2}>
                      <button type="submit" disabled={isSubmitting} data-cursor="Send" className="btn btn-solid !px-9 !py-5 !text-base disabled:cursor-not-allowed disabled:opacity-60">
                        {isSubmitting ? (
                          <>
                            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden>
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Sending…
                          </>
                        ) : (
                          <>
                            Send message <Send size={16} />
                          </>
                        )}
                      </button>
                    </Magnetic>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </Reveal>
        </div>
      </section>
    </PageTransition>
  );
};

export default Contact;
