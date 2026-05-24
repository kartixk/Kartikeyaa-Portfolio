import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Phone, MapPin, Github, Linkedin, ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';
import PageTransition from '@/components/PageTransition';
import PageHeader from '@/components/PageHeader';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Reveal } from '@/components/fx';

const DEFAULT_API_BASE_URL = 'https://kartikeyaa-portfolio.onrender.com';

const normalizeBaseUrl = (value?: string) => {
  if (!value) return null;
  return value.replace(/\/+$/, '');
};

const fetchWithTimeout = async (url: string, options: RequestInit, timeoutMs = 12000) => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    window.clearTimeout(timeoutId);
  }
};

const buildApiCandidates = (path: string) => {
  const envBase = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);
  const candidates = import.meta.env.DEV
    ? [`/api/${path}`, envBase ? `${envBase}/api/${path}` : null, `${DEFAULT_API_BASE_URL}/api/${path}`]
    : [envBase ? `${envBase}/api/${path}` : null, `${DEFAULT_API_BASE_URL}/api/${path}`];
  return [...new Set(candidates.filter((value): value is string => Boolean(value)))];
};

const contactLinks = [
  { icon: Mail, label: 'Email', value: 'kartikeyaa15@gmail.com', href: 'https://mail.google.com/mail/?view=cm&fs=1&to=kartikeyaa15@gmail.com', external: true },
  { icon: Phone, label: 'Phone', value: '+91-8250977949', href: 'tel:+918250977949' },
  { icon: MapPin, label: 'Location', value: 'Visakhapatnam, India', href: '#' },
  { icon: Github, label: 'GitHub', value: 'github.com/kartixk', href: 'https://github.com/kartixk', external: true },
  { icon: Linkedin, label: 'LinkedIn', value: 'b-venkata-sai-kartikeya', href: 'https://linkedin.com/in/b-venkata-sai-kartikeya-28a99b357', external: true },
];

const inputClass =
  'peer w-full rounded-xl border border-line/[0.08] bg-line/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 transition-all focus:border-brand-2/50 focus:outline-none focus:ring-2 focus:ring-brand-2/30';
const labelClass = 'mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = { name, email, phone: phone || undefined, message };
      const apiCandidates = buildApiCandidates('contact');
      let submitError: Error | null = null;
      let delivered = false;

      for (const endpoint of apiCandidates) {
        try {
          const response = await fetchWithTimeout(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (!response.ok) {
            const data = await response.json().catch(() => null);
            const msg = data?.error || `Failed (${response.status})`;
            if ([404, 503, 504].includes(response.status)) { submitError = new Error(msg); continue; }
            throw new Error(msg);
          }
          delivered = true;
          break;
        } catch (error) {
          submitError = error instanceof DOMException && error.name === 'AbortError'
            ? new Error('Request timed out.')
            : error instanceof Error ? error : new Error('Network request failed');
          continue;
        }
      }

      if (!delivered) throw submitError || new Error('Failed to send message');
      toast.success("Message sent! I'll get back to you soon.");
      setName(''); setEmail(''); setPhone(''); setMessage('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="gradient-bg">
        <PageHeader
          eyebrow="Contact"
          title={
            <>
              <span className="text-foreground">Let's build</span>{' '}
              <span className="aurora-text">something great</span>{' '}
              <span className="text-outline italic">together.</span>
            </>
          }
          subtitle="Always open to new opportunities, collaborations, and interesting conversations. Drop me a message — I'll get back within 24 hours."
        />

        <section className="section-container !pt-4">
          <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-12">
            {/* LEFT */}
            <Reveal>
              <div className="mb-5 space-y-2.5">
                {contactLinks.map(({ icon: Icon, label, value, href, external }) => (
                  <div key={label} className="relative rounded-2xl border-[0.75px] border-border p-1.5">
                    <GlowingEffect spread={40} glow disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
                    <a
                      href={href}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noopener noreferrer' : undefined}
                      className="group relative flex items-center justify-between rounded-xl glass-panel px-5 py-4 transition-colors hover:border-brand-2/30"
                    >
                      <div className="flex items-center gap-4">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-brand-2/20 bg-brand-2/10 transition-all group-hover:border-brand-2/40 group-hover:bg-brand-2/20">
                          <Icon className="text-brand-2" size={16} />
                        </div>
                        <div>
                          <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
                          <p className="text-sm font-medium text-foreground">{value}</p>
                        </div>
                      </div>
                      {href !== '#' && (
                        <ArrowUpRight size={15} className="text-muted-foreground/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-2" />
                      )}
                    </a>
                  </div>
                ))}
              </div>

              <div className="relative rounded-2xl border-[0.75px] border-border p-2">
                <GlowingEffect spread={40} glow disabled={false} proximity={64} inactiveZone={0.01} borderWidth={3} />
                <div className="relative rounded-xl glass-panel border border-brand-3/15 p-5">
                  <div className="mb-2 flex items-center gap-3">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-3 opacity-60" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand-3" />
                    </span>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-3">Currently Available</p>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Open to full-time roles, internships, and freelance projects. Response time is typically within 24 hours.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* RIGHT — form */}
            <Reveal delay={0.1}>
              <div className="relative rounded-3xl border-[0.75px] border-border p-2">
                <GlowingEffect spread={44} glow disabled={false} proximity={70} inactiveZone={0.01} borderWidth={3} />
                <form onSubmit={handleSubmit} className="relative space-y-5 overflow-hidden rounded-2xl glass-panel p-7 md:p-9">
                  <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-brand-1/10 blur-3xl" />
                  <div className="relative z-10 space-y-5">
                    <div>
                      <label className={labelClass}>Name <span className="text-brand-2">*</span></label>
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="Your full name" />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className={labelClass}>Email <span className="text-brand-2">*</span></label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="your@email.com" />
                      </div>
                      <div>
                        <label className={labelClass}>Phone <span className="font-normal normal-case tracking-normal text-muted-foreground/40">(optional)</span></label>
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="+91 XXXXX XXXXX" />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Message <span className="text-brand-2">*</span></label>
                      <textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)} className={`${inputClass} resize-none`} placeholder="Tell me about your project, idea, or just say hello..." />
                    </div>
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                      className="btn-gradient flex w-full items-center justify-center gap-2.5 rounded-xl px-6 py-4 text-sm font-bold tracking-wide disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSubmitting ? (
                          <>
                            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Sending...
                          </>
                        ) : (
                          <>Send Message <Send size={15} /></>
                        )}
                    </motion.button>
                  </div>
                </form>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Contact;
