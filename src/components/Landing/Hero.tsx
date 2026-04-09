import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import HeroDemo from './HeroDemo';
import InteractiveCharacter from '../Character/InteractiveCharacter';

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center px-6 pt-24 pb-16 overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[900px] h-[700px] bg-primary-600/10 rounded-full blur-[150px]" />
        <div className="absolute top-[20%] left-[30%] w-[400px] h-[400px] bg-violet-500/6 rounded-full blur-[120px]" />
        <div className="absolute top-[25%] right-[25%] w-[350px] h-[350px] bg-indigo-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Badge */}
      <motion.div
        className="relative flex items-center gap-2 px-4 py-1.5 rounded-full border border-surface-800 bg-surface-900/50 backdrop-blur-sm mb-6 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Sparkles size={14} className="text-primary-400" />
        <span className="text-xs text-surface-400">你的 AI 设计助手</span>
      </motion.div>

      {/* Character Video + Title overlay */}
      <div className="relative flex flex-col items-center">
        {/* Interactive character */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.1, ease: 'easeOut' }}
        >
          <InteractiveCharacter />
        </motion.div>

        {/* Title below character */}
        <motion.h1
          className="relative text-center text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.1] text-surface-50 mt-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          设计部
          <span className="bg-gradient-to-r from-primary-400 via-primary-300 to-primary-500 bg-clip-text text-transparent">
            {' '}0号员工
          </span>
        </motion.h1>
      </div>

      {/* Sub heading */}
      <motion.p
        className="relative text-center text-lg md:text-xl text-surface-400 mt-5 max-w-2xl leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.45 }}
      >
        以本土虚拟数字人为载体，承接重复性设计任务
        <br className="hidden md:block" />
        实现设计能力的规模化生产与调用
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        className="relative flex flex-wrap items-center justify-center gap-4 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.55 }}
      >
        <a
          href="#demo"
          className="group flex items-center gap-2 px-7 py-3 rounded-full bg-white text-surface-950 font-medium text-sm hover:bg-surface-100 transition-all shadow-lg shadow-white/10"
        >
          立即体验
          <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
        </a>
        <a
          href="#features"
          className="flex items-center gap-2 px-7 py-3 rounded-full border border-surface-700 text-surface-300 font-medium text-sm hover:bg-surface-800/50 hover:text-surface-100 transition-all"
        >
          了解更多
        </a>
      </motion.div>

      {/* Demo Preview */}
      <motion.div
        className="relative w-full max-w-4xl mt-20"
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.65 }}
      >
        <HeroDemo />
      </motion.div>
    </section>
  );
}
