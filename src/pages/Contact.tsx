import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Phone, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import PageTransition from '@/components/PageTransition';
import SectionHeader from '@/components/SectionHeader';
import { useContactStore } from '@/stores/contactStore';

// Simple debounce hook
let debounceTimer: ReturnType<typeof setTimeout>;
const debounce = (fn: (...args: any[]) => void, ms: number) => {
  return (...args: any[]) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => fn(...args), ms);
  };
};

const Contact = () => {
  const { name, email, message, isSubmitting, setField, setSubmitting, reset } = useContactStore();

  const debouncedSetField = useCallback(
    (field: 'name' | 'email' | 'message') =>
      debounce((value: string) => setField(field, value), 300),
    [setField]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error('Please fill in all fields');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      toast.success('Message sent! I\'ll get back to you soon.');
      reset();
      setSubmitting(false);
    }, 1000);
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 gradient-bg">
        <div className="section-container">
          <SectionHeader title="Contact" subtitle="Let's work together" />

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <p className="text-muted-foreground leading-relaxed">
                I'm always open to new opportunities, collaborations, and interesting conversations. Feel free to reach out!
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Mail className="text-primary" size={18} />
                  </div>
                  <span className="text-muted-foreground">kartikeyaa15@gmail.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Phone className="text-primary" size={18} />
                  </div>
                  <span className="text-muted-foreground">+91-8250977949</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <MapPin className="text-primary" size={18} />
                  </div>
                  <span className="text-muted-foreground">Visakhapatnam, India</span>
                </div>
              </div>
            </motion.div>

            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card glow-border p-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Name</label>
                <input
                  type="text"
                  defaultValue={name}
                  onChange={(e) => debouncedSetField('name')(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                <input
                  type="email"
                  defaultValue={email}
                  onChange={(e) => debouncedSetField('email')(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Message</label>
                <textarea
                  rows={4}
                  defaultValue={message}
                  onChange={(e) => debouncedSetField('message')(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow resize-none"
                  placeholder="What's on your mind?"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50 glow-border"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'} <Send size={16} />
              </button>
            </motion.form>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Contact;
