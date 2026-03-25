import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function GlassCard({ children, className = "", delay = 0 }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`bg-[#0a0a0c]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl shadow-cyan-900/10 hover:border-cyan-500/30 transition-all duration-500 ${className}`}
    >
      {children}
    </motion.div>
  );
}