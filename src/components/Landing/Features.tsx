import { useRef, useState } from 'react';
import { motion, useInView, useTransform } from 'framer-motion';
import { accentMap, showcases } from '../../content/showcases';
import { useMagneticMotion } from '../../hooks/useMagneticMotion';
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
  const { x, y, handleMouseMove, handleMouseLeave } = useMagneticMotion({
    strength: isActive ? 18 : 12,
    stiffness: 200,
    damping: 16,
  });
  const rotateY = useTransform(x, [-18, 18], [-4.5, 4.5]);
  const rotateX = useTransform(y, [-18, 18], [4.5, -4.5]);

  return (
    <motion.a
      ref={ref}
      href={`#showcase/${feature.slug}`}
      style={{
        x,
        y,
        rotateX,
        rotateY,
        transformPerspective: 1400,
        transformStyle: 'preserve-3d',
      }}
      className={`group relative overflow-hidden rounded-2xl bg-surface-900/40 backdrop-blur-sm transition-colors transform-gpu ${
        isActive ? 'z-10 shadow-2xl shadow-black/35' : 'z-0 shadow-xl shadow-black/12'
      }`}
      initial={{ opacity: 0, y: 56, scale: 0.96, filter: 'blur(12px)' }}
      animate={isInView ? { opacity: 1, y: 0, scale: cardScale, filter: 'blur(0px)' } : { scale: cardScale }}
      transition={{ duration: 0.5, delay: isInView ? 0.18 + index * 0.08 : 0 }}
      onMouseEnter={() => onHoverStart(feature.slug)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        handleMouseLeave();
        onHoverEnd();
      }}
    >
      <div className="flex h-full flex-col p-8 md:p-10 [transform:translateZ(0)]">
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
            className={`mt-8 flex-1 min-h-[220px] w-full rounded-xl object-cover ${colors.glow}`}
          />
        ) : (
          <div className={`mt-8 flex min-h-[220px] flex-1 items-center justify-center rounded-xl ${colors.glow}`}>
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
    <section id="features" className="relative px-6 pt-44 pb-32 md:pt-52">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div ref={headerRef} className="text-center max-w-5xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 42, filter: 'blur(10px)' }}
            animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.65, delay: 0.08 }}
          >
            <InteractiveTitle
              src="/assets/creative-work-title.svg"
              alt="Creative Work"
              className="mx-auto h-auto w-full max-w-[600px] object-contain"
            />
          </motion.div>
          <motion.p
            className="text-lg text-surface-400 mt-4 mx-auto max-w-2xl"
            initial={{ opacity: 0, y: 26, filter: 'blur(8px)' }}
            animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.6, delay: 0.18 }}
          >
            一些有趣的创意化内容探索
          </motion.p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
          initial={{ opacity: 0, y: 34 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.16 }}
        >
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
        </motion.div>
      </div>
    </section>
  );
}
