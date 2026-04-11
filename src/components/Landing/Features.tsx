import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { accentMap, showcases } from '../../content/showcases';
import InteractiveTitle from '../common/InteractiveTitle';

function FeatureCard({
  feature,
  index,
  activeSlug,
  onHoverStart,
  onHoverEnd,
}: {
  feature: typeof showcases[number];
  index: number;
  activeSlug: string | null;
  onHoverStart: (slug: string) => void;
  onHoverEnd: () => void;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const colors = accentMap[feature.accent];
  const isActive = activeSlug === feature.slug;
  const isDimmed = Boolean(activeSlug) && !isActive;
  const cardScale = isActive ? 1.085 : isDimmed ? 0.92 : 1;

  return (
    <motion.a
      ref={ref}
      href={`#showcase/${feature.slug}`}
      className={`relative rounded-2xl border ${colors.border} bg-surface-900/40 backdrop-blur-sm overflow-hidden transition-colors group transform-gpu ${
        isActive ? 'z-10 shadow-2xl shadow-black/30' : 'z-0'
      }`}
      initial={{ opacity: 0, y: 30, scale: 1 }}
      animate={isInView ? { opacity: 1, y: 0, scale: cardScale } : { scale: cardScale }}
      transition={{ duration: 0.4, delay: isInView ? index * 0.08 : 0 }}
      onMouseEnter={() => onHoverStart(feature.slug)}
      onMouseLeave={onHoverEnd}
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
        {feature.coverSrc ? (
          <img
            src={feature.coverSrc}
            alt={`${feature.title} 封面`}
            className={`flex-1 mt-8 min-h-[220px] w-full rounded-xl border border-surface-800/40 object-cover ${colors.glow}`}
          />
        ) : (
          <div className={`flex-1 mt-8 rounded-xl ${colors.glow} border border-surface-800/40 min-h-[220px] flex items-center justify-center`}>
            <feature.icon size={40} className="text-surface-600" />
          </div>
        )}

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
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  return (
    <section id="features" className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div ref={headerRef} className="text-center max-w-5xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <InteractiveTitle
              src="/assets/creative-work-title.svg"
              alt="Creative Work"
              className="mx-auto h-auto w-full max-w-[600px] object-contain"
            />
          </motion.div>
          <motion.p
            className="text-lg text-surface-400 mt-4 mx-auto max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            一些有趣的创意化内容探索
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {showcases.map((feature, i) => (
            <FeatureCard
              key={feature.tag}
              feature={feature}
              index={i}
              activeSlug={activeSlug}
              onHoverStart={setActiveSlug}
              onHoverEnd={() => setActiveSlug(null)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
