import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import ChatWindow from '../Chat/ChatWindow';

export default function DemoSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="demo" className="relative py-32 px-6" ref={ref}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#FFB8DF]/8 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <motion.span
            className="text-xs text-[#FFB8DF] tracking-widest uppercase font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            立即体验
          </motion.span>
          <motion.h2
            className="text-4xl md:text-5xl font-semibold text-surface-50 tracking-tight mt-4"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            与LQB数字人对话
          </motion.h2>
          <motion.p
            className="text-lg text-surface-400 mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            输入你的设计需求，体验 AI 设计助手的工作方式
          </motion.p>
        </div>

        {/* Chat window */}
        <motion.div
          className="w-full rounded-2xl border border-surface-800/80 bg-surface-900/60 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/40 h-[640px] relative"
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <ChatWindow />
        </motion.div>
      </div>
    </section>
  );
}
