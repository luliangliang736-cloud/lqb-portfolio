import { useRef, useState } from 'react';
import { motion, useInView, useTransform } from 'framer-motion';
import { accentMap, showcases } from '../../content/showcases';
import { useMagneticMotion } from '../../hooks/useMagneticMotion';
import InteractiveTitle from '../common/InteractiveTitle';

function FeatureCard({
  feature,
  activeSlug,
  onHoverStart,
  onHoverEnd,
}: {
  feature: typeof showcases[number];
  activeSlug: string | null;
  onHoverStart: (slug: string) => void;
  onHoverEnd: () => void;
}) {
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
      href={`#showcase/${feature.slug}`}
      style={{
        x,
        y,
        rotateX,
        rotateY,
        transformPerspective: 1400,
        transformStyle: 'preserve-3d',
      }}
      animate={{
        scale: cardScale,
        filter: isDimmed ? 'saturate(0.82) brightness(0.88)' : 'saturate(1) brightness(1)',
      }}
      transition={{ type: 'spring', stiffness: 220, damping: 18, mass: 0.8 }}
      className={`group relative flex h-full overflow-hidden rounded-2xl bg-surface-900/40 backdrop-blur-sm transition-[box-shadow,background-color] duration-300 transform-gpu ${
        isActive ? 'z-10 shadow-2xl shadow-black/35' : 'z-0 shadow-xl shadow-black/12'
      }`}
      onMouseEnter={() => onHoverStart(feature.slug)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        handleMouseLeave();
        onHoverEnd();
      }}
    >
      <div className="flex h-full flex-col p-8 md:p-10 [transform:translateZ(0)]">
        <div>
          <span className={`mb-6 inline-flex self-start items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${colors.tag}`}>
            <feature.icon size={12} />
            {feature.tag}
          </span>

          <h3 className="whitespace-pre-line text-2xl font-semibold leading-tight text-surface-50 md:text-3xl">
            {feature.title}
          </h3>

          <p className="mt-4 max-w-lg leading-relaxed text-surface-400">
            {feature.description}
          </p>
        </div>

        {feature.coverSrc ? (
          <img
            src={feature.coverSrc}
            alt={`${feature.title} 封面`}
            className={`mt-8 min-h-[220px] w-full flex-1 rounded-xl object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] ${colors.glow}`}
          />
        ) : (
          <div className={`mt-8 flex min-h-[220px] flex-1 items-center justify-center rounded-xl transition-transform duration-500 ease-out group-hover:scale-[1.03] ${colors.glow}`}>
            <feature.icon size={40} className="text-surface-600" />
          </div>
        )}

        <span className={`mt-6 inline-flex items-center gap-1 text-sm font-medium ${colors.ctaBg} transition-colors`}>
          {feature.cta}
          <span className="transition-transform group-hover:translate-x-0.5">&rarr;</span>
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
      <div className="mx-auto max-w-7xl">
        <div ref={headerRef} className="mx-auto mb-16 max-w-5xl text-center">
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
            className="mx-auto mt-4 max-w-2xl text-lg text-surface-400"
            initial={{ opacity: 0, y: 26, filter: 'blur(8px)' }}
            animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.6, delay: 0.18 }}
          >
            一些有趣的创意化内容探索
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {showcases.map((feature) => (
            <FeatureCard
              key={feature.tag}
              feature={feature}
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
