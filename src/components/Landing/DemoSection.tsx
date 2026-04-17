import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import ChatWindow from '../Chat/ChatWindow';
import InteractiveTitle from '../common/InteractiveTitle';

export default function DemoSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="demo" className="relative px-6 pt-4 pb-32 md:pt-8" ref={ref}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#FFB8DF]/8 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: 38, filter: 'blur(10px)' }}
            animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.65, delay: 0.06 }}
          >
            <InteractiveTitle
              src="/assets/lqb-ai-title.svg"
              alt="与LQB数字人对话"
              className="mx-auto h-auto w-full max-w-[250px] object-contain"
            />
          </motion.div>
          <motion.p
            className="text-lg text-surface-400 mt-4"
            initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
            animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.6, delay: 0.16 }}
          >
            输入你的设计需求，体验 AI 设计助手的工作方式
          </motion.p>
        </div>

        {/* Chat window */}
        <motion.div
          className="g2-card-xl relative h-[640px] w-full bg-[#0A0A0B] shadow-2xl shadow-black/35 backdrop-blur-xl"
          initial={{ opacity: 0, y: 54, scale: 0.965, filter: 'blur(12px)' }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.75, delay: 0.22 }}
        >
          <ChatWindow />
        </motion.div>
      </div>
    </section>
  );
}
