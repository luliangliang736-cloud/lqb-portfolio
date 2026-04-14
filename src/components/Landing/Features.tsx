import { useRef, useState } from 'react';
import { motion, useInView, useTransform } from 'framer-motion';
import { accentMap, showcases } from '../../content/showcases';
import { useMagneticMotion } from '../../hooks/useMagneticMotion';
import InteractiveTitle from '../common/InteractiveTitle';

const collageCardSize = 21.5;
const collageOuterLeft = -0.75;
const collageInnerLeft = 18.25;
const collageCenterLeft = 39.25;
const collageInnerRight = 60.25;
const collageOuterRight = 79.25;

const collageCards = [
  {
    alt: '占位卡片 1',
    left: collageOuterLeft,
    top: 11.5,
    size: collageCardSize,
    angle: -28,
    scatter: { x: -20, y: -10, rotate: -34 },
  },
  {
    alt: '占位卡片 2',
    left: collageInnerLeft,
    top: 2,
    size: collageCardSize,
    angle: -12,
    scatter: { x: -15, y: -18, rotate: -18 },
  },
  {
    alt: '占位卡片 3',
    left: collageCenterLeft,
    top: -3.5,
    size: collageCardSize,
    angle: 0,
    scatter: { x: 0, y: -32, rotate: 0 },
  },
  {
    alt: '占位卡片 4',
    left: collageInnerRight,
    top: 2,
    size: collageCardSize,
    angle: 12,
    scatter: { x: 15, y: -18, rotate: 18 },
  },
  {
    alt: '占位卡片 5',
    left: collageOuterRight,
    top: 11.5,
    size: collageCardSize,
    angle: 28,
    scatter: { x: 20, y: -10, rotate: 34 },
  },
  {
    alt: '占位卡片 6',
    left: collageOuterLeft,
    top: 67,
    size: collageCardSize,
    angle: 28,
    scatter: { x: -20, y: 14, rotate: 34 },
  },
  {
    alt: '占位卡片 7',
    left: collageInnerLeft,
    top: 77,
    size: collageCardSize,
    angle: 12,
    scatter: { x: -14, y: 18, rotate: 18 },
  },
  {
    alt: '占位卡片 8',
    left: collageCenterLeft,
    top: 82.5,
    size: collageCardSize,
    angle: 0,
    scatter: { x: 0, y: 30, rotate: 0 },
  },
  {
    alt: '占位卡片 9',
    left: collageInnerRight,
    top: 77,
    size: collageCardSize,
    angle: -12,
    scatter: { x: 14, y: 18, rotate: -18 },
  },
  {
    alt: '占位卡片 10',
    left: collageOuterRight,
    top: 67,
    size: collageCardSize,
    angle: -28,
    scatter: { x: 20, y: 14, rotate: -34 },
  },
];

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
  const cardScale = isActive ? 1.1 : isDimmed ? 0.93 : 1;
  const { x, y, handleMouseMove, handleMouseLeave } = useMagneticMotion({
    strength: isActive ? 14 : 10,
    stiffness: 170,
    damping: 20,
  });
  const rotateY = useTransform(x, [-14, 14], [-3.2, 3.2]);
  const rotateX = useTransform(y, [-14, 14], [3.2, -3.2]);

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
        filter: isDimmed ? 'saturate(0.88) brightness(0.9)' : 'saturate(1) brightness(1)',
      }}
      transition={{ type: 'spring', stiffness: 150, damping: 22, mass: 0.95 }}
      className={`group relative flex h-full overflow-hidden rounded-2xl bg-surface-900/40 backdrop-blur-sm transition-[box-shadow,background-color] duration-500 transform-gpu will-change-transform ${
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
            className={`mt-8 min-h-[220px] w-full flex-1 rounded-xl object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.025] ${colors.glow}`}
          />
        ) : (
          <div className={`mt-8 flex min-h-[220px] flex-1 items-center justify-center rounded-xl transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.025] ${colors.glow}`}>
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
  const collageRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(headerRef, { once: true, margin: '-80px' });
  const collageInView = useInView(collageRef, { once: true, margin: '-120px' });
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [collageHovered, setCollageHovered] = useState(false);
  const [hoveredCollageIndex, setHoveredCollageIndex] = useState<number | null>(null);
  const [collageCopyHovered, setCollageCopyHovered] = useState(false);

  return (
    <section id="features" className="relative px-6 pt-44 pb-32 md:pt-52">
      <div className="mx-auto max-w-7xl">
        <div className="relative mb-40 px-2 py-4 md:mb-52 md:px-0">
          <div
            ref={collageRef}
            className="relative mx-auto aspect-square w-full max-w-[760px] md:max-w-[820px]"
            onMouseEnter={() => setCollageHovered(true)}
            onMouseLeave={() => {
              setCollageHovered(false);
              setHoveredCollageIndex(null);
            }}
          >
            {collageCards.map((card, index) => {
                return (
                  <motion.div
                    key={`${card.alt}-${index}`}
                    className="absolute"
                    style={{
                      left: `${card.left}%`,
                      top: `${card.top}%`,
                      width: `${card.size}%`,
                      transformOrigin: `${((50 - card.left) / card.size) * 100}% ${((50 - card.top) / card.size) * 100}%`,
                      zIndex: hoveredCollageIndex === index ? 30 : 10,
                    }}
                    initial={{ opacity: 0, y: 24, scale: 0.94, rotate: 0 }}
                    animate={collageInView ? {
                      opacity: 1,
                      y: 0,
                      x: 0,
                      scale: 1,
                      rotate: 360,
                    } : {}}
                    transition={{
                      opacity: { duration: 0.45, delay: 0.04 + index * 0.02 },
                      x: { duration: 0.45, delay: 0.04 + index * 0.02, ease: 'easeOut' },
                      y: { duration: 0.45, delay: 0.04 + index * 0.02, ease: 'easeOut' },
                      scale: { duration: 0.45, delay: 0.06 + index * 0.03, ease: 'easeOut' },
                      rotate: { duration: 2.2, delay: 0.06, ease: 'linear' },
                    }}
                  >
                    <motion.div
                      className="overflow-hidden rounded-[24px] border border-[#2A2A2A] bg-[#1B1B1B] shadow-[0_18px_40px_rgba(0,0,0,0.18)]"
                      initial={{ rotate: card.angle }}
                      onMouseEnter={() => setHoveredCollageIndex(index)}
                      onMouseLeave={() => setHoveredCollageIndex((current) => (current === index ? null : current))}
                      animate={collageHovered ? {
                        x: card.scatter.x,
                        y: card.scatter.y,
                        rotate: card.angle - 360 + card.scatter.rotate,
                        scale: hoveredCollageIndex === index ? 1.12 : 1.03,
                      } : {
                        x: 0,
                        y: 0,
                        rotate: collageInView ? card.angle - 360 : card.angle,
                        scale: hoveredCollageIndex === index ? 1.08 : 1,
                      }}
                      transition={{
                        rotate: collageHovered
                          ? { type: 'spring', stiffness: 180, damping: 18, mass: 0.9 }
                          : collageInView
                            ? { duration: 2.2, delay: 0.06, ease: 'linear' }
                            : { duration: 0.45, ease: 'easeOut' },
                        x: { type: 'spring', stiffness: 180, damping: 18, mass: 0.9, delay: index * 0.02 },
                        y: { type: 'spring', stiffness: 180, damping: 18, mass: 0.9, delay: index * 0.02 },
                        scale: { type: 'spring', stiffness: 180, damping: 18, mass: 0.9, delay: index * 0.02 },
                      }}
                    >
                      <div className="flex aspect-square w-full items-center justify-center bg-[#1B1B1B] text-xs tracking-[0.16em] text-surface-500 uppercase">
                        Card
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}

            <motion.div
              className="absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 text-center"
              initial={{ opacity: 0, y: 28, filter: 'blur(10px)' }}
              animate={collageInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
              transition={{ duration: 0.55, delay: 0.02 }}
            >
              <motion.div
                animate={collageCopyHovered
                  ? { opacity: 0.12, y: -4, scale: 0.992, filter: 'blur(6px)' }
                  : { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.32, ease: 'easeOut' }}
              >
                <InteractiveTitle
                  src="/assets/creativeAI.svg"
                  alt="Creative AI"
                  className="mx-auto h-[42px] w-auto object-contain sm:h-[54px] md:h-[72px]"
                />
              </motion.div>
              <motion.div
                className="mx-auto mt-4 max-w-md space-y-3 text-[10px] leading-5 text-surface-600 transition-[transform,color] duration-300 ease-out hover:text-surface-300 md:text-[11px] md:leading-5.5"
                onHoverStart={() => setCollageCopyHovered(true)}
                onHoverEnd={() => setCollageCopyHovered(false)}
                whileHover={{ scale: 1.3 }}
                transition={{ type: 'spring', stiffness: 220, damping: 18 }}
              >
                <p>
                  我是陆78，这里不是一份被归档的静态作品，而是一处仍在生长中的实验现场。
                </p>
                <p>
                  让技术成为放大 imagination 的引擎，而不是替代判断与感受力的答案。
                </p>
                <p>
                  我更关心 AI 如何参与创作、触发偏离、制造新秩序，而不是只追求更快地产出结果。这里是一些正在生长中的方向，而不是被固定下来的结论。
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>

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
