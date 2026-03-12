import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Phone, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import PageTransition from '@/components/PageTransition';
import SectionHeader from '@/components/SectionHeader';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-warm the Render server when the page loads so it's awake when user submits
  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
    if (baseUrl) {
      fetch(`${baseUrl}/api/health`, { method: 'GET' }).catch(() => {/* silent */});
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout for Render cold starts

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      console.log('Using API Base URL:', baseUrl ? baseUrl : 'EMPTY (Using relative path)');
      const response = await fetch(`${baseUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone: phone || undefined, message }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        const errMsg = data?.error || `Server error (${response.status})`;
        throw new Error(errMsg);
      }

      toast.success("Message sent! I'll get back to you soon.");
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (error: unknown) {
      clearTimeout(timeoutId);
      console.error('Contact form error:', error);
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          toast.error('Request timed out. The server may be waking up — please try again in 30 seconds.');
        } else if (error.message.toLowerCase().includes('failed to fetch') || error.message.toLowerCase().includes('networkerror')) {
          toast.error('Could not connect to the server. Please check your internet or try again later.');
        } else {
          toast.error(`Failed to send: ${error.message}`);
        }
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-10 gradient-bg flex flex-col justify-center">
        <div className="section-container !py-4 flex items-center">
          <div className="w-full max-w-4xl mx-auto">
            <SectionHeader title="Contact" subtitle="Let's work together" />

            <div className="grid md:grid-cols-2 gap-12 items-start">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8 py-4"
              >
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold gradient-text">Get in Touch</h3>
                  <p className="text-muted-foreground leading-relaxed max-w-md">
                    I'm always open to new opportunities, collaborations, and interesting conversations. Feel free to reach out!
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4 group">
                    <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Mail className="text-primary" size={20} />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Email</p>
                      <span className="text-foreground font-medium">kartikeyaa15@gmail.com</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group">
                    <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Phone className="text-primary" size={20} />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Phone</p>
                      <span className="text-foreground font-medium">+91-8250977949</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group">
                    <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <MapPin className="text-primary" size={20} />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Location</p>
                      <span className="text-foreground font-medium">Visakhapatnam, India</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="glass-card glow-border p-8 space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5 ml-1">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg bg-muted/30 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-inter"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5 ml-1">Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg bg-muted/30 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-inter"
                      placeholder="Optional"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5 ml-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-muted/30 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-inter"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5 ml-1">Message</label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-muted/30 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-inter resize-none"
                    placeholder="What's on your mind?"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 mt-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed glow-border"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message <Send size={18} />
                    </>
                  )}
                </button>
              </motion.form>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Contact;
