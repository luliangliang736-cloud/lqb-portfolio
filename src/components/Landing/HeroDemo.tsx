import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Image, Layers, CheckCircle } from 'lucide-react';

const steps = [
  { icon: CheckCircle, text: '正在分析设计需求', done: '已分析设计需求' },
  { icon: CheckCircle, text: '正在检索品牌规范', done: '已匹配品牌规范' },
  { icon: CheckCircle, text: '正在生成设计方案', done: '已生成设计方案' },
];

const resultCards = [
  { label: '活动海报', size: '1080 × 1920' },
  { label: '社媒横版', size: '1200 × 628' },
  { label: 'Banner', size: '1920 × 600' },
];

export default function HeroDemo() {
  const [phase, setPhase] = useState(0); // 0=idle, 1=analyzing, 2=done
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1500);
    const t2 = setTimeout(() => setCurrentStep(1), 2800);
    const t3 = setTimeout(() => setCurrentStep(2), 4000);
    const t4 = setTimeout(() => setPhase(2), 5200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  return (
    <div className="rounded-2xl border border-surface-800/80 bg-surface-900/60 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/40">
      {/* Top bar */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-surface-800/60">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-surface-700" />
          <span className="w-3 h-3 rounded-full bg-surface-700" />
          <span className="w-3 h-3 rounded-full bg-surface-700" />
        </div>
        <div className="flex-1 flex justify-center">
          <span className="text-xs text-surface-500">LQB · 设计部0号员工</span>
        </div>
        <div className="w-12" />
      </div>

      {/* Content */}
      <div className="p-6 md:p-8 min-h-[360px] flex flex-col">
        {/* Sidebar tabs */}
        <div className="flex gap-2 mb-6">
          {['品牌海报', '社媒宣发', '产品营销'].map((tab, i) => (
            <span
              key={tab}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                i === 0
                  ? 'border-primary-500/40 bg-primary-500/10 text-primary-300'
                  : 'border-surface-700/50 text-surface-500'
              }`}
            >
              {tab}
            </span>
          ))}
        </div>

        {/* Chat area */}
        <div className="flex-1 space-y-4">
          {/* User message */}
          <div className="flex justify-end">
            <div className="bg-primary-600/20 border border-primary-500/20 rounded-2xl rounded-br-md px-4 py-3 max-w-sm">
              <p className="text-sm text-surface-100">
                为新一代跑鞋设计一套产品详情页视觉素材，包括主图和特写
              </p>
            </div>
          </div>

          {/* AI response */}
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
              K
            </div>
            <div className="flex-1 space-y-3">
              {/* Steps */}
              <AnimatePresence mode="wait">
                {phase >= 1 && (
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {steps.map((step, i) => {
                      const isComplete = phase === 2 || i < currentStep;
                      const isActive = phase === 1 && i === currentStep;
                      return (
                        <motion.div
                          key={i}
                          className="flex items-center gap-2"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.15, duration: 0.25 }}
                        >
                          {isComplete ? (
                            <CheckCircle size={14} className="text-emerald-400" />
                          ) : isActive ? (
                            <motion.div
                              className="w-3.5 h-3.5 rounded-full border-2 border-primary-400 border-t-transparent"
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                            />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border-2 border-surface-600" />
                          )}
                          <span className={`text-xs ${isComplete ? 'text-surface-300' : isActive ? 'text-primary-300' : 'text-surface-500'}`}>
                            {isComplete ? step.done : step.text}
                          </span>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Result */}
              <AnimatePresence>
                {phase === 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-3 mt-2"
                  >
                    <p className="text-sm text-surface-200">
                      已为你生成一套产品视觉素材，聚焦速度感和材质细节：
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      {resultCards.map((card, i) => (
                        <motion.div
                          key={card.label}
                          className="rounded-xl border border-surface-700/50 bg-surface-800/50 p-3 flex flex-col items-center gap-2"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.15 * i, duration: 0.3 }}
                        >
                          <div className="w-full aspect-[3/4] rounded-lg bg-gradient-to-br from-surface-700/50 to-surface-800 flex items-center justify-center">
                            {i === 0 ? <Image size={20} className="text-surface-500" /> : <Layers size={20} className="text-surface-500" />}
                          </div>
                          <span className="text-xs text-surface-300">{card.label}</span>
                          <span className="text-[10px] text-surface-500">{card.size}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Input bar */}
        <div className="flex items-center gap-2 mt-6 px-4 py-2.5 rounded-xl border border-surface-700/50 bg-surface-800/40">
          <span className="text-sm text-surface-500 flex-1">输入设计需求…</span>
          <div className="w-8 h-8 rounded-lg bg-surface-700/50 flex items-center justify-center">
            <Send size={14} className="text-surface-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
