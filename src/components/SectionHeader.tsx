import { motion } from 'framer-motion';

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  number?: string;
};

const SectionHeader = ({ title, subtitle, number }: SectionHeaderProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="mb-12"
  >
    {number && <p className="text-xs tracking-[0.35em] uppercase text-muted-foreground mb-2">{number}</p>}
    <h2 className="section-title">{title}</h2>
    {subtitle && <p className="section-subtitle">{subtitle}</p>}
  </motion.div>
);

export default SectionHeader;
