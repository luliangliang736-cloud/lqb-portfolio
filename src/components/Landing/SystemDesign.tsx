import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const cards = [
  {
    title: '品牌海报',
    gradient: 'from-violet-600/20 to-indigo-600/20',
    border: 'border-violet-500/20',
  },
  {
    title: '产品详情页',
    gradient: 'from-blue-600/20 to-cyan-600/20',
    border: 'border-blue-500/20',
  },
  {
    title: '社媒横版',
    gradient: 'from-emerald-600/20 to-teal-600/20',
    border: 'border-emerald-500/20',
  },
  {
    title: '活动 Banner',
    gradient: 'from-amber-600/20 to-orange-600/20',
    border: 'border-amber-500/20',
  },
];

export default function SystemDesign() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="relative py-32 px-6" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Label */}
        <motion.span
          className="text-xs text-primary-400 tracking-widest uppercase font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          自主智能
        </motion.span>

        {/* Heading */}
        <motion.h2
          className="text-4xl md:text-5xl lg:text-6xl font-semibold text-surface-50 tracking-tight mt-4 max-w-3xl leading-[1.15]"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          以系统思维设计
        </motion.h2>

        {/* Description */}
        <motion.p
          className="text-lg text-surface-400 mt-5 max-w-2xl leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          设计决策，并非一座孤岛。Kaya 将色彩、版式、语言统一为完整的品牌体系，
          从第一稿，到第一百稿。
        </motion.p>

        {/* Cards grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              className={`rounded-2xl border ${card.border} bg-gradient-to-br ${card.gradient} backdrop-blur-sm p-5 flex flex-col justify-between aspect-[3/4] group hover:scale-[1.02] transition-transform`}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
            >
              <div className="w-full flex-1 rounded-xl bg-surface-900/40 flex items-center justify-center">
                <div className="w-12 h-12 rounded-xl bg-surface-800/60 border border-surface-700/40" />
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-surface-200">{card.title}</p>
                <p className="text-xs text-surface-500 mt-1">自动生成</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
