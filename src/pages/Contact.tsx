import { useState } from 'react';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      const response = await fetch(`${baseUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone: phone || undefined, message }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || 'Failed to send message');
      }

      toast.success("Message sent! I'll get back to you soon.");
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong while sending your message. Please try again.');
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
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 mt-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 glow-border"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'} <Send size={18} />
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
