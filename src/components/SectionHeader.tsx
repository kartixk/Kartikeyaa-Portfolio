import { motion } from 'framer-motion';

const SectionHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="mb-12"
  >
    <h2 className="section-title">{title}</h2>
    {subtitle && <p className="section-subtitle">{subtitle}</p>}
  </motion.div>
);

export default SectionHeader;
