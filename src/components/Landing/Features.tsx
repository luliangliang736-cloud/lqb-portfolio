import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MousePointerClick, Palette, Type, Eye } from 'lucide-react';

const features = [
  {
    icon: MousePointerClick,
    tag: '精准编辑',
    title: '懂你所想，\n精准编辑',
    description: '精准定点修改，只改该改之处。Kaya 保持设计品质，让每一次编辑都恰到好处。',
    cta: '体验精准编辑',
    accent: 'primary',
  },
  {
    icon: Palette,
    tag: '风格一致性',
    title: '每一次创作，\n风格始终如一',
    description: 'Kaya 洞察你的风格，在不同形式与项目中保持一致。无论迭代多少版，辨识度始终在线。',
    cta: '探索风格一致性',
    accent: 'violet',
  },
  {
    icon: Type,
    tag: '文字编辑',
    title: '自由编辑文字，\n灵活且可控',
    description: '文字，不必困于画面。Kaya 智能分层，让图中文字独立可编辑。画面完整，表达无拘。',
    cta: '体验文字编辑',
    accent: 'emerald',
  },
  {
    icon: Eye,
    tag: '视觉洞察',
    title: '设计参考，\n贵在精准',
    description: 'Kaya 实时检索全网，为你甄选真正相关的灵感，契合你的审美，指向你的答案。',
    cta: '探索视觉洞察',
    accent: 'amber',
  },
];

const accentMap: Record<string, { tag: string; border: string; glow: string; ctaBg: string }> = {
  primary: {
    tag: 'text-primary-400 bg-primary-500/10 border-primary-500/20',
    border: 'border-primary-500/15 hover:border-primary-500/30',
    glow: 'bg-primary-500/5',
    ctaBg: 'text-primary-400 hover:text-primary-300',
  },
  violet: {
    tag: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    border: 'border-violet-500/15 hover:border-violet-500/30',
    glow: 'bg-violet-500/5',
    ctaBg: 'text-violet-400 hover:text-violet-300',
  },
  emerald: {
    tag: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    border: 'border-emerald-500/15 hover:border-emerald-500/30',
    glow: 'bg-emerald-500/5',
    ctaBg: 'text-emerald-400 hover:text-emerald-300',
  },
  amber: {
    tag: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    border: 'border-amber-500/15 hover:border-amber-500/30',
    glow: 'bg-amber-500/5',
    ctaBg: 'text-amber-400 hover:text-amber-300',
  },
};

function FeatureCard({ feature, index }: { feature: typeof features[number]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const colors = accentMap[feature.accent];
  const isWide = index % 3 === 0;

  return (
    <motion.div
      ref={ref}
      className={`rounded-2xl border ${colors.border} bg-surface-900/40 backdrop-blur-sm overflow-hidden transition-colors group ${
        isWide ? 'md:col-span-2' : ''
      }`}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="p-8 md:p-10 flex flex-col h-full">
        {/* Tag */}
        <span className={`inline-flex self-start items-center gap-1.5 text-xs px-3 py-1 rounded-full border ${colors.tag} mb-6`}>
          <feature.icon size={12} />
          {feature.tag}
        </span>

        {/* Title */}
        <h3 className="text-2xl md:text-3xl font-semibold text-surface-50 whitespace-pre-line leading-tight">
          {feature.title}
        </h3>

        {/* Description */}
        <p className="text-surface-400 mt-4 leading-relaxed max-w-lg">
          {feature.description}
        </p>

        {/* Preview area */}
        <div className={`flex-1 mt-8 rounded-xl ${colors.glow} border border-surface-800/40 min-h-[180px] flex items-center justify-center`}>
          <feature.icon size={40} className="text-surface-600" />
        </div>

        {/* CTA */}
        <a href="#demo" className={`inline-flex items-center gap-1 text-sm font-medium mt-6 ${colors.ctaBg} transition-colors`}>
          {feature.cta}
          <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
        </a>
      </div>
    </motion.div>
  );
}

export default function Features() {
  const headerRef = useRef(null);
  const isInView = useInView(headerRef, { once: true, margin: '-80px' });

  return (
    <section id="features" className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div ref={headerRef} className="text-center max-w-2xl mx-auto mb-16">
          <motion.span
            className="text-xs text-primary-400 tracking-widest uppercase font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            功能特性
          </motion.span>
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-semibold text-surface-50 tracking-tight mt-4 leading-[1.15]"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            设计, 不止于生成
          </motion.h2>
          <motion.p
            className="text-lg text-surface-400 mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            AI 只是起点，品味由你来主导。
          </motion.p>
        </div>

        {/* Cards Grid - Lovart-style bento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <FeatureCard key={feature.tag} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
