import { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { Send, Mail, Phone, MapPin, Github, Linkedin, ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';
import PageTransition from '@/components/PageTransition';
import { GlowingEffect } from '@/components/ui/glowing-effect';

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

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 },
  }),
};

const contactLinks = [
  { icon: Mail, label: 'Email', value: 'kartikeyaa15@gmail.com', href: 'mailto:kartikeyaa15@gmail.com' },
  { icon: Phone, label: 'Phone', value: '+91-8250977949', href: 'tel:+918250977949' },
  { icon: MapPin, label: 'Location', value: 'Visakhapatnam, India', href: '#' },
  { icon: Github, label: 'GitHub', value: 'github.com/kartikeya', href: 'https://github.com', external: true },
  { icon: Linkedin, label: 'LinkedIn', value: 'linkedin.com/in/kartikeya', href: 'https://linkedin.com', external: true },
];

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
      <div className="min-h-screen gradient-bg">

        {/* ── HERO STRIP ── */}
        <div className="relative pt-32 pb-16 overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-20 blur-[120px]"
              style={{ background: 'radial-gradient(ellipse, hsl(var(--primary)) 0%, transparent 70%)' }}
            />
          </div>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div variants={fadeUp} initial="hidden" animate="show" className="flex items-center gap-3 mb-6">
              <span className="h-px w-8 bg-primary/60" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">Contact</span>
            </motion.div>
            <motion.h1
              variants={fadeUp} custom={1} initial="hidden" animate="show"
              className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-[1.05] mb-5"
            >
              <span className="text-foreground">Let's build</span>
              <br />
              <span className="gradient-text">something great</span>
              <br />
              <span className="text-foreground italic">together.</span>
            </motion.h1>
            <motion.p
              variants={fadeUp} custom={2} initial="hidden" animate="show"
              className="text-muted-foreground text-lg max-w-xl leading-relaxed"
            >
              Always open to new opportunities, collaborations, and interesting conversations.
              Drop me a message — I'll get back to you within 24 hours.
            </motion.p>
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-16 items-start">

            {/* ── LEFT: Contact links ── */}
            <motion.div
              variants={fadeUp} custom={0} initial="hidden" whileInView="show" viewport={{ once: true }}
            >
              <div className="space-y-2 mb-10">
                {contactLinks.map(({ icon: Icon, label, value, href, external }, i) => (
                  <div key={label} className="relative rounded-2xl border-[0.75px] border-border p-1.5">
                    <GlowingEffect spread={40} glow disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
                    <motion.a
                      href={href}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noopener noreferrer' : undefined}
                      variants={fadeUp} custom={i}
                      initial="hidden" whileInView="show" viewport={{ once: true }}
                      whileHover={{ x: 4 }}
                      className="relative flex items-center justify-between px-5 py-4 rounded-xl glass-card border border-border/40 group hover:border-primary/30 hover:shadow-[0_0_20px_hsl(var(--primary)/0.08)] transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/20 group-hover:border-primary/40 transition-all duration-300">
                          <Icon className="text-primary" size={16} />
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-muted-foreground mb-0.5">{label}</p>
                          <p className="text-sm text-foreground font-medium">{value}</p>
                        </div>
                      </div>
                      {href !== '#' && (
                        <ArrowUpRight
                          size={15}
                          className="text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
                        />
                      )}
                    </motion.a>
                  </div>
                ))}
              </div>

              {/* Availability chip */}
              <div className="relative rounded-2xl border-[0.75px] border-border p-2">
                <GlowingEffect spread={40} glow disabled={false} proximity={64} inactiveZone={0.01} borderWidth={3} />
                <motion.div
                  variants={fadeUp} custom={6} initial="hidden" whileInView="show" viewport={{ once: true }}
                  className="relative glass-card p-5 rounded-xl border border-accent/20"
                >
                <div className="flex items-center gap-3 mb-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
                  </span>
                  <p className="text-xs font-semibold tracking-[0.14em] uppercase text-accent">Currently Available</p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Open to full-time roles, internships, and freelance projects. Response time is typically within 24 hours.
                </p>
                </motion.div>
              </div>
            </motion.div>

            {/* ── RIGHT: Form ── */}
            <motion.div
              variants={fadeUp} custom={1} initial="hidden" whileInView="show" viewport={{ once: true }}
            >
              <div className="relative rounded-2xl border-[0.75px] border-border p-2">
                <GlowingEffect spread={40} glow disabled={false} proximity={64} inactiveZone={0.01} borderWidth={3} />
              <form
                onSubmit={handleSubmit}
                className="relative glass-card glow-border p-7 md:p-9 space-y-5 overflow-hidden rounded-xl"
              >
                {/* Subtle corner glow */}
                <div className="pointer-events-none absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />

                <div className="relative z-10 space-y-5">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold tracking-[0.14em] uppercase text-muted-foreground mb-2">
                      Name <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all text-sm"
                      placeholder="Your full name"
                    />
                  </div>

                  {/* Email + Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold tracking-[0.14em] uppercase text-muted-foreground mb-2">
                        Email <span className="text-primary">*</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all text-sm"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold tracking-[0.14em] uppercase text-muted-foreground mb-2">
                        Phone <span className="text-muted-foreground/40 normal-case tracking-normal font-normal">(optional)</span>
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all text-sm"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-semibold tracking-[0.14em] uppercase text-muted-foreground mb-2">
                      Message <span className="text-primary">*</span>
                    </label>
                    <textarea
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all resize-none text-sm"
                      placeholder="Tell me about your project, idea, or just say hello..."
                    />
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    className="w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm tracking-wide hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
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
            </motion.div>
          </div>
        </section>

      </div>
    </PageTransition>
  );
};

export default Contact;