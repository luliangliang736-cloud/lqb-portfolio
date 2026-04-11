import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { accentMap, showcases } from '../../content/showcases';

function FeatureCard({ feature, index }: { feature: typeof showcases[number]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const colors = accentMap[feature.accent];

  return (
    <motion.a
      ref={ref}
      href={`#showcase/${feature.slug}`}
      className={`rounded-2xl border ${colors.border} bg-surface-900/40 backdrop-blur-sm overflow-hidden transition-colors group`}
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
        <div className={`flex-1 mt-8 rounded-xl ${colors.glow} border border-surface-800/40 min-h-[220px] flex items-center justify-center`}>
          <feature.icon size={40} className="text-surface-600" />
        </div>

        {/* CTA */}
        <span className={`inline-flex items-center gap-1 text-sm font-medium mt-6 ${colors.ctaBg} transition-colors`}>
          {feature.cta}
          <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
        </span>
      </div>
    </motion.a>
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
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-semibold text-surface-50 tracking-tight leading-[1.15]"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            创意作品
          </motion.h2>
          <motion.p
            className="text-lg text-surface-400 mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            四大板块，集中呈现陆七八的创意内容及过程
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {showcases.map((feature, i) => (
            <FeatureCard key={feature.tag} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
