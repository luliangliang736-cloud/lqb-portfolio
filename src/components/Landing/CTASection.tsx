import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="relative py-32 px-6" ref={ref}>
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary-600/8 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.h2
          className="text-4xl md:text-5xl lg:text-6xl font-semibold text-surface-50 tracking-tight leading-[1.15]"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          用 Kaya 设计
        </motion.h2>
        <motion.p
          className="text-lg text-surface-400 mt-5 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          全速创作，让愿景成真
        </motion.p>
        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <a
            href="#demo"
            className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-surface-950 font-medium text-sm hover:bg-surface-100 transition-all shadow-lg shadow-white/10"
          >
            免费开始
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
