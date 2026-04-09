import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ChatWindow from '../Chat/ChatWindow';

interface DemoSectionProps {
  onOpenEditor?: () => void;
}

export default function DemoSection({ onOpenEditor }: DemoSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="demo" className="relative py-32 px-6" ref={ref}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-primary-600/6 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <motion.span
            className="text-xs text-primary-400 tracking-widest uppercase font-medium"
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
            与 Kaya 对话
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
          className="max-w-2xl mx-auto rounded-2xl border border-surface-800/80 bg-surface-900/60 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/40 h-[600px] cursor-pointer group relative"
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          onClick={onOpenEditor}
        >
          <ChatWindow />
          {/* Click overlay */}
          <div className="absolute inset-0 bg-surface-950/0 group-hover:bg-surface-950/60 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 z-10">
            <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-surface-950 font-medium text-sm shadow-xl">
              打开设计工作台
              <ArrowRight size={16} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
