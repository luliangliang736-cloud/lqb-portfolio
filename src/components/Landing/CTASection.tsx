import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { toAssetPath } from '../../utils/assetPath';
import InteractiveTitle from '../common/InteractiveTitle';

export default function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="relative px-5 pt-8 pb-16 sm:px-6 sm:pt-10 sm:pb-20 lg:pt-12 lg:pb-22 xl:pt-14 xl:pb-24" ref={ref}>
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 h-[280px] w-[420px] -translate-x-1/2 rounded-full bg-primary-600/8 blur-[90px] sm:h-[340px] sm:w-[520px] lg:h-[380px] lg:w-[560px] xl:h-[400px] xl:w-[600px] xl:blur-[120px]" />
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
            className="mx-auto h-auto w-full max-w-[320px] object-contain sm:max-w-[390px] xl:max-w-[460px]"
            spinOnHover
          />
        </motion.div>
        <motion.p
          className="mx-auto mt-2 max-w-xl px-4 text-base text-surface-400 sm:px-0 sm:text-lg"
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
