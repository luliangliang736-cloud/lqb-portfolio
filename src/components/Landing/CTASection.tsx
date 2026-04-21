import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { toAssetPath } from '../../utils/assetPath';
import InteractiveTitle from '../common/InteractiveTitle';

export default function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="relative px-6 pt-10 pb-20 md:pt-14 md:pb-24" ref={ref}>
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary-600/8 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
          animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.65 }}
        >
          <InteractiveTitle
            src={toAssetPath('/assets/third-title.svg')}
            alt="用LQB设计"
            className="mx-auto h-auto w-full max-w-[460px] object-contain"
          />
        </motion.div>
        <motion.p
          className="mx-auto mt-2 max-w-xl text-lg text-surface-400"
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          全速创作，让愿景成真
        </motion.p>
      </div>
    </section>
  );
}
