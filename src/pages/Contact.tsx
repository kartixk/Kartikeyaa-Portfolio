import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Phone, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { useEffect } from 'react';
import PageTransition from '@/components/PageTransition';
import SectionHeader from '@/components/SectionHeader';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch("https://kartikeyaa-portfolio.onrender.com/api/health").catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Determine the correct base URL
      const baseUrl = import.meta.env.DEV 
        ? 'http://localhost:5000' 
        : (import.meta.env.VITE_API_BASE_URL || 'https://kartikeyaa-portfolio.onrender.com');

      const response = await fetch(`${baseUrl}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone: phone || undefined,
          message,
        }),
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
      <div className="h-screen pt-20 flex flex-col justify-center gradient-bg overflow-hidden">
        <div className="w-full max-w-5xl mx-auto px-6">
          <SectionHeader title="Contact" subtitle="Let's work together" />

          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <p className="text-white/70 leading-relaxed text-lg font-light">
                I'm always open to new opportunities, collaborations, and interesting conversations. Feel free to reach out!
              </p>
              <div className="space-y-6 pt-4">
                <div className="flex items-center gap-4 group cursor-default">
                  <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                    <Mail className="text-primary" size={22} />
                  </div>
                  <span className="text-white/90 text-lg font-light tracking-wide">kartikeyaa15@gmail.com</span>
                </div>
                <div className="flex items-center gap-4 group cursor-default">
                  <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                    <Phone className="text-primary" size={22} />
                  </div>
                  <span className="text-white/90 text-lg font-light tracking-wide">+91-8250977949</span>
                </div>
                <div className="flex items-center gap-4 group cursor-default">
                  <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                    <MapPin className="text-primary" size={22} />
                  </div>
                  <span className="text-white/90 text-lg font-light tracking-wide">Visakhapatnam, India</span>
                </div>
              </div>
            </motion.div>

            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-6 md:p-8 space-y-5"
            >
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1.5 geist-font">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-light"
                  placeholder="Your name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1.5 geist-font">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-light"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1.5 geist-font">Phone <span className="text-white/40">(optional)</span></label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-light"
                    placeholder="+91-"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1.5 geist-font">Message</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all resize-none font-light"
                  placeholder="What's on your mind?"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 mt-4 rounded-lg primary-button text-black font-semibold tracking-wide disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'} <Send size={18} />
              </button>
            </motion.form>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Contact;
