import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent, type WheelEvent as ReactWheelEvent } from 'react';
import { motion, useInView, useMotionTemplate, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { accentMap, showcases } from '../../content/showcases';
import { useMagneticMotion } from '../../hooks/useMagneticMotion';
import { toAssetPath } from '../../utils/assetPath';
import InteractiveTitle from '../common/InteractiveTitle';

const collageCardSize = 23.5;
const collageSpread = 1.12;

function spreadFromCenter(value: number) {
  return 50 + (value - 50) * collageSpread;
}

const collageOuterLeft = spreadFromCenter(-0.75);
const collageInnerLeft = spreadFromCenter(18.25);
const collageCenterLeft = spreadFromCenter(39.25);
const collageInnerRight = spreadFromCenter(60.25);
const collageOuterRight = spreadFromCenter(79.25);

const collageCards = [
  {
    alt: '占位卡片 1',
    imageSrc: toAssetPath('/assets/collage-cards/card-04.png'),
    left: collageOuterLeft,
    top: spreadFromCenter(11.5),
    size: collageCardSize,
    angle: -28,
    scatter: { x: -20, y: -10, rotate: -34 },
  },
  {
    alt: '占位卡片 2',
    imageSrc: toAssetPath('/assets/collage-cards/card-01.png'),
    left: collageInnerLeft,
    top: spreadFromCenter(2),
    size: collageCardSize,
    angle: -12,
    scatter: { x: -15, y: -18, rotate: -18 },
  },
  {
    alt: '占位卡片 3',
    imageSrc: toAssetPath('/assets/collage-cards/card-08.png'),
    left: collageCenterLeft,
    top: spreadFromCenter(-3.5),
    size: collageCardSize,
    angle: 0,
    scatter: { x: 0, y: -32, rotate: 0 },
  },
  {
    alt: '占位卡片 4',
    imageSrc: toAssetPath('/assets/collage-cards/card-03.png'),
    left: collageInnerRight,
    top: spreadFromCenter(2),
    size: collageCardSize,
    angle: 12,
    scatter: { x: 15, y: -18, rotate: 18 },
  },
  {
    alt: '占位卡片 5',
    imageSrc: toAssetPath('/assets/collage-cards/card-05.png'),
    left: collageOuterRight,
    top: spreadFromCenter(11.5),
    size: collageCardSize,
    angle: 28,
    scatter: { x: 20, y: -10, rotate: 34 },
  },
  {
    alt: '占位卡片 6',
    imageSrc: toAssetPath('/assets/collage-cards/card-07.png'),
    left: collageOuterLeft,
    top: spreadFromCenter(67),
    size: collageCardSize,
    angle: 28,
    scatter: { x: -20, y: 14, rotate: 34 },
  },
  {
    alt: '占位卡片 7',
    imageSrc: toAssetPath('/assets/collage-cards/card-10.png'),
    left: collageInnerLeft,
    top: spreadFromCenter(77),
    size: collageCardSize,
    angle: 12,
    scatter: { x: -14, y: 18, rotate: 18 },
  },
  {
    alt: '占位卡片 8',
    imageSrc: toAssetPath('/assets/collage-cards/card-02.png'),
    left: collageCenterLeft,
    top: spreadFromCenter(82.5),
    size: collageCardSize,
    angle: 0,
    scatter: { x: 0, y: 30, rotate: 0 },
  },
  {
    alt: '占位卡片 9',
    imageSrc: toAssetPath('/assets/collage-cards/card-06.png'),
    left: collageInnerRight,
    top: spreadFromCenter(77),
    size: collageCardSize,
    angle: -12,
    scatter: { x: 14, y: 18, rotate: -18 },
  },
  {
    alt: '占位卡片 10',
    imageSrc: toAssetPath('/assets/collage-cards/card-09.png'),
    left: collageOuterRight,
    top: spreadFromCenter(67),
    size: collageCardSize,
    angle: -28,
    scatter: { x: 20, y: 14, rotate: -34 },
  },
];
const collageSpiralOrder = [2, 1, 0, 5, 6, 7, 8, 9, 3, 4];
const collageSpiralOrderIndex = Object.fromEntries(
  collageSpiralOrder.map((cardIndex, orderIndex) => [cardIndex, orderIndex]),
);

const parallaxPanelImage = toAssetPath('/assets/parallax-theater.webp');
const homeInfiniteScrollAssetVersion = '20260423-2';
const recentWorksItems = Array.from({ length: 13 }, (_, index) => ({
  title: `首页无限滚动 ${index + 1}`,
  src: toAssetPath(`/assets/home-infinite-scroll/slide-${String(index + 1).padStart(2, '0')}.png?v=${homeInfiniteScrollAssetVersion}`),
  colorGroup: [
    'blue',
    'warm-light',
    'light',
    'green',
    'green',
    'warm',
    'blue',
    'dark',
    'green-dark',
    'olive',
    'neutral',
    'light',
    'neutral',
  ][index] ?? 'neutral',
}));
const GOLDEN_RATIO = 1.61803398875;
const RHYTHM_EXPONENTS = [-0.82, -0.46, -0.14, 0, -0.28, -0.64, -0.08, -0.52];
const headingLineVariants = {
  rest: {
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
  },
  hover: (index: number) => {
    const layouts = [
      { x: 18, y: -8, rotate: -1.2, scale: 1.02 },
      { x: -22, y: 6, rotate: 0.8, scale: 0.995 },
      { x: 14, y: 14, rotate: -0.6, scale: 1.01 },
    ];

    return layouts[index] ?? layouts[0];
  },
};
const headingWordVariants = {
  rest: {
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
  },
  hover: (index: number) => {
    const layouts = [
      { x: -12, y: -8, rotate: -2.2, scale: 1.02 },
      { x: 16, y: 8, rotate: 1.4, scale: 0.985 },
      { x: -8, y: 12, rotate: -1.2, scale: 1.01 },
      { x: 14, y: -10, rotate: 2, scale: 1.03 },
      { x: -16, y: 6, rotate: -1.6, scale: 0.99 },
      { x: 10, y: 10, rotate: 1.1, scale: 1.015 },
      { x: -6, y: -12, rotate: -2, scale: 1.01 },
      { x: 12, y: 4, rotate: 1.8, scale: 0.99 },
    ];

    return layouts[index] ?? layouts[0];
  },
};

function wrapLoop(value: number, width: number) {
  if (width <= 0) {
    return 0;
  }

  let next = value % width;

  if (next > 0) {
    next -= width;
  }

  return next;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getRhythmScale(index: number) {
  return Math.pow(GOLDEN_RATIO, RHYTHM_EXPONENTS[index % RHYTHM_EXPONENTS.length] ?? 0);
}

function RecentWorksLoop() {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const frameRef = useRef<number | null>(null);
  const hoveredCardKeyRef = useRef<string | null>(null);
  const dragStateRef = useRef({
    active: false,
    pointerId: null as number | null,
    lastX: 0,
    lastTime: 0,
  });
  const motionRef = useRef({
    currentX: 0,
    targetX: 0,
    velocity: -1.35,
  });
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);
  const [isDragging, setIsDragging] = useState(false);
  const [imageDimensions, setImageDimensions] = useState(() => recentWorksItems.map(() => ({
    width: 1,
    height: 1,
  })));
  const orderedItems = useMemo(() => {
    const entries = recentWorksItems.map((item, index) => ({
      ...item,
      originalIndex: index,
      width: imageDimensions[index]?.width ?? 1,
      height: imageDimensions[index]?.height ?? 1,
    }));

    const sorted = [...entries].sort((a, b) => b.width - a.width);
    const next: typeof sorted = [];
    const pool = [...sorted];

    while (pool.length) {
      const previous = next[next.length - 1];
      const previousGroup = previous?.colorGroup ?? null;
      const previousWidth = previous?.width ?? null;
      const candidateIndex = pool.findIndex((item, index) => {
        if (!previous) {
          return index === 0;
        }

        if (item.colorGroup === previousGroup) {
          return false;
        }

        return previousWidth === null || Math.abs(item.width - previousWidth) > previousWidth * 0.12;
      });

      if (candidateIndex >= 0) {
        next.push(pool.splice(candidateIndex, 1)[0]);
        continue;
      }

      const fallbackIndex = pool.findIndex((item) => item.colorGroup !== previousGroup);

      if (fallbackIndex >= 0) {
        next.push(pool.splice(fallbackIndex, 1)[0]);
        continue;
      }

      next.push(pool.shift()!);
    }

    return next;
  }, [imageDimensions]);

  const overlapPx = viewportWidth < 768 ? 8 : 10;
  const gap = -overlapPx;
  const topPadding = viewportWidth < 768 ? 18 : 24;
  const bottomPadding = viewportWidth < 768 ? 6 : 8;
  const targetPeakHeight = viewportWidth < 768 ? 255 : viewportWidth < 1180 ? 342 : 405;
  const maxCardWidth = viewportWidth < 768 ? 285 : viewportWidth < 1180 ? 429 : 525;
  const cardGeometry = orderedItems.map((item, index) => {
    let height = Math.max(96, Math.round(targetPeakHeight * getRhythmScale(index)));
    let width = Math.max(72, Math.round((item.width / Math.max(item.height, 1)) * height));

    if (width > maxCardWidth) {
      const resizeRatio = maxCardWidth / width;
      width = maxCardWidth;
      height = Math.max(96, Math.round(height * resizeRatio));
    }

    return { width, height };
  });
  const itemWidths = cardGeometry.map((item) => item.width);
  const itemHeights = cardGeometry.map((item) => item.height);
  const tallestHeight = itemHeights.length ? Math.max(...itemHeights) : targetPeakHeight;
  const itemPositions = itemWidths.reduce<number[]>((positions, _, index) => {
    const previousWidth = index === 0 ? 0 : itemWidths[index - 1] ?? 0;
    const previousPosition = index === 0 ? 0 : positions[index - 1] ?? 0;
    positions.push(index === 0 ? 0 : previousPosition + previousWidth + gap);
    return positions;
  }, []);
  const stripWidth = itemWidths.reduce((sum, width) => sum + width, 0) + gap * Math.max(0, recentWorksItems.length - 1);
  const cloneRadius = Math.max(2, Math.ceil(viewportWidth / Math.max(stripWidth, 1)) + 1);
  const cloneOffsets = Array.from({ length: cloneRadius * 2 + 1 }, (_, index) => index - cloneRadius);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let disposed = false;

    recentWorksItems.forEach((item, index) => {
      const image = new Image();
      image.src = item.src;
      image.onload = () => {
        if (disposed || !image.naturalWidth || !image.naturalHeight) {
          return;
        }

        setImageDimensions((current) => {
          const next = [...current];
          next[index] = {
            width: image.naturalWidth,
            height: image.naturalHeight,
          };
          return next;
        });
      };
    });

    return () => {
      disposed = true;
    };
  }, []);

  useEffect(() => {
    const animate = () => {
      const viewport = viewportRef.current;
      const track = trackRef.current;

      if (!viewport || !track || stripWidth <= 0) {
        frameRef.current = window.requestAnimationFrame(animate);
        return;
      }

      const viewportRect = viewport.getBoundingClientRect();
      const viewportCenter = viewportRect.width / 2;
      const edgeThreshold = viewportRect.width * 0.24;
      const idleSpeed = -0.38;
      const motion = motionRef.current;

      if (!dragStateRef.current.active) {
        motion.targetX += motion.velocity + idleSpeed;
        motion.velocity *= 0.93;

        if (Math.abs(motion.velocity) < 0.02) {
          motion.velocity = 0;
        }
      }

      motion.targetX = wrapLoop(motion.targetX, stripWidth);
      motion.currentX += (motion.targetX - motion.currentX) * (dragStateRef.current.active ? 0.22 : 0.085);
      motion.currentX = wrapLoop(motion.currentX, stripWidth);

      const renderedX = Math.round(motion.currentX);
      track.style.transform = `translate3d(${renderedX}px, 0, 0)`;

      cardRefs.current.forEach((card) => {
        if (!card) {
          return;
        }

        const itemIndex = Number(card.dataset.itemIndex ?? 0);
        const cloneIndex = Number(card.dataset.cloneIndex ?? 0);
        const cardKey = card.dataset.cardKey ?? '';
        const cardWidth = itemWidths[itemIndex] ?? 1;
        const baseLeft = (cloneIndex * stripWidth) + (itemPositions[itemIndex] ?? 0);
        const cardCenter = baseLeft + renderedX + (cardWidth / 2);
        const distanceFromCenter = Math.abs(cardCenter - viewportCenter);
        const edgeProgress = clamp(
          (distanceFromCenter - edgeThreshold) / ((viewportRect.width / 2) + cardWidth - edgeThreshold),
          0,
          1,
        );
        const side = cardCenter < viewportCenter ? -1 : 1;
        const isHovered = hoveredCardKeyRef.current === cardKey && !dragStateRef.current.active;
        const hoverScale = isHovered ? 1.075 : 1;
        const hoverLift = isHovered ? -10 : 0;
        const hoverRotateX = isHovered ? 4.5 : 0;
        const hoverRotateY = isHovered ? side * 8 : 0;
        const opacity = isHovered ? 1 : 1 - edgeProgress * 0.14;
        const brightness = isHovered ? 1.04 : 1 - edgeProgress * 0.16;
        const saturate = isHovered ? 1.04 : 1 - edgeProgress * 0.12;

        card.style.transformOrigin = side < 0 ? 'right center' : 'left center';
        card.style.transform = `perspective(1200px) translate3d(0, ${hoverLift}px, 0) scale(${hoverScale}) rotateX(${hoverRotateX}deg) rotateY(${hoverRotateY}deg)`;
        card.style.opacity = `${opacity}`;
        card.style.filter = `brightness(${brightness}) saturate(${saturate})`;
        card.style.zIndex = `${isHovered ? 220 : Math.max(1, 100 - Math.round(distanceFromCenter / 8))}`;
      });

      frameRef.current = window.requestAnimationFrame(animate);
    };

    frameRef.current = window.requestAnimationFrame(animate);

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [itemHeights, itemPositions, itemWidths, stripWidth]);

  const handleWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const delta = (event.deltaY + event.deltaX) * 0.82;
    const motion = motionRef.current;
    motion.targetX -= delta;
    motion.velocity -= delta * 0.035;
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragStateRef.current = {
      active: true,
      pointerId: event.pointerId,
      lastX: event.clientX,
      lastTime: performance.now(),
    };
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const finishDrag = (event?: ReactPointerEvent<HTMLDivElement>) => {
    if (
      event &&
      dragStateRef.current.pointerId === event.pointerId &&
      event.currentTarget.hasPointerCapture(event.pointerId)
    ) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    dragStateRef.current.active = false;
    dragStateRef.current.pointerId = null;
    setIsDragging(false);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragStateRef.current.active) {
      return;
    }

    const now = performance.now();
    const dx = event.clientX - dragStateRef.current.lastX;
    const deltaTime = Math.max(16, now - dragStateRef.current.lastTime);

    dragStateRef.current.lastX = event.clientX;
    dragStateRef.current.lastTime = now;

    const motion = motionRef.current;
    motion.targetX += dx * 1.15;
    motion.velocity = (dx / deltaTime) * 16;
  };

  return (
    <section className="relative left-1/2 right-1/2 mt-24 mb-52 w-screen -translate-x-1/2 md:mt-32 md:mb-64">
      <div className="mt-8 pt-32 mb-72 flex items-start justify-between gap-4 px-6 md:mt-12 md:pt-36 md:mb-[24rem] md:px-10">
        <motion.div
          className="relative"
          initial="rest"
          whileHover="hover"
        >
          <h3 className="text-[2.2rem] font-medium uppercase leading-[0.9] tracking-[-0.08em] text-[#F2F0E8] md:text-[5.8rem]">
            <span className="block">
            <motion.span
              className="inline-block origin-left"
              variants={headingLineVariants}
              custom={0}
              transition={{ type: 'spring', stiffness: 220, damping: 18, mass: 0.9 }}
            >
              <motion.span
                className="inline-block"
                variants={headingWordVariants}
                custom={0}
                transition={{ type: 'spring', stiffness: 260, damping: 18, mass: 0.8 }}
              >
                Recent
              </motion.span>
              <span className="inline-block w-[0.18em] md:w-[0.22em]" aria-hidden="true" />
              <motion.span
                className="inline-block"
                variants={headingWordVariants}
                custom={1}
                transition={{ type: 'spring', stiffness: 260, damping: 18, mass: 0.8, delay: 0.02 }}
              >
                W<span className="text-[#9CFF3F]">O</span>r<span className="text-[#9CFF3F]">K</span>s
              </motion.span>
            </motion.span></span>
            <span className="mt-3 block md:mt-4">
            <motion.span
              className="inline-flex origin-left items-baseline gap-[0.22em] md:gap-[0.28em]"
              variants={headingLineVariants}
              custom={1}
              transition={{ type: 'spring', stiffness: 220, damping: 18, mass: 0.9, delay: 0.02 }}
            >
              <motion.span
                className="inline-block"
                variants={headingWordVariants}
                custom={2}
                transition={{ type: 'spring', stiffness: 260, damping: 18, mass: 0.8 }}
              >
                Hey
              </motion.span>
              <motion.span
                className="inline-block"
                variants={headingWordVariants}
                custom={3}
                transition={{ type: 'spring', stiffness: 260, damping: 18, mass: 0.8, delay: 0.02 }}
              >
                Creative
              </motion.span>
              <motion.span
                className="inline-block"
                variants={headingWordVariants}
                custom={4}
                transition={{ type: 'spring', stiffness: 260, damping: 18, mass: 0.8, delay: 0.04 }}
              >
                Design
              </motion.span>
            </motion.span></span>
            <span className="mt-3 block md:mt-4">
            <motion.span
              className="inline-flex origin-left items-baseline gap-[0.2em] md:gap-[0.26em]"
              variants={headingLineVariants}
              custom={2}
              transition={{ type: 'spring', stiffness: 220, damping: 18, mass: 0.9, delay: 0.04 }}
            >
              <motion.span
                className="inline-block"
                variants={headingWordVariants}
                custom={5}
                transition={{ type: 'spring', stiffness: 260, damping: 18, mass: 0.8 }}
              >
                Just
              </motion.span>
              <motion.span
                className="inline-block"
                variants={headingWordVariants}
                custom={6}
                transition={{ type: 'spring', stiffness: 260, damping: 18, mass: 0.8, delay: 0.02 }}
              >
                For
              </motion.span>
              <motion.span
                className="inline-block"
                variants={headingWordVariants}
                custom={7}
                transition={{ type: 'spring', stiffness: 260, damping: 18, mass: 0.8, delay: 0.04 }}
              >
                <span className="text-[#FFB8DF]">@</span>Future
              </motion.span>
            </motion.span></span>
          </h3>
        </motion.div>
        <motion.svg
          width="116"
          height="116"
          viewBox="0 0 116 116"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mt-1 h-10 w-10 shrink-0 md:h-14 md:w-14"
          aria-hidden="true"
          whileHover={{ scaleX: -1 }}
          transition={{ duration: 0.28, ease: 'easeInOut' }}
        >
          <rect x="15.6719" y="84.0684" width="22.1632" height="22.1632" rx="4" transform="rotate(45 15.6719 84.0684)" fill="#D9D9D9" />
          <rect x="71.7207" y="84.0684" width="22.1632" height="22.1632" rx="4" transform="rotate(45 71.7207 84.0684)" fill="#D9D9D9" />
          <rect x="43.6914" y="84.0684" width="22.1632" height="22.1632" rx="4" transform="rotate(45 43.6914 84.0684)" fill="#D9D9D9" />
          <rect x="99.7402" y="84.0684" width="22.1632" height="22.1632" rx="4" transform="rotate(45 99.7402 84.0684)" fill="#D9D9D9" />
          <rect x="115.412" y="15.6719" width="22.1632" height="22.1632" rx="4" transform="rotate(135 115.412 15.6719)" fill="#D9D9D9" />
          <rect x="115.412" y="71.7207" width="22.1632" height="22.1632" rx="4" transform="rotate(135 115.412 71.7207)" fill="#D9D9D9" />
          <rect x="115.412" y="43.6914" width="22.1632" height="22.1632" rx="4" transform="rotate(135 115.412 43.6914)" fill="#D9D9D9" />
          <path d="M6.09675 15.7026L13.928 7.77433C15.4648 6.21843 17.9663 6.18522 19.5439 7.69977L84.3828 69.947C86.0246 71.5232 86.0222 74.1498 84.3775 75.723L75.0053 84.6877C73.434 86.1907 70.95 86.1632 69.4123 84.6259L6.11443 21.3423C4.55883 19.7871 4.55093 17.2676 6.09675 15.7026Z" fill="#D9D9D9" />
        </motion.svg>
      </div>

      <div
        ref={viewportRef}
        className={`relative overflow-hidden bg-transparent px-0 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} touch-none select-none`}
        style={{
          height: `${topPadding + tallestHeight + bottomPadding}px`,
        }}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onPointerLeave={() => {
          if (!dragStateRef.current.active) {
            return;
          }
          dragStateRef.current.active = false;
          dragStateRef.current.pointerId = null;
          setIsDragging(false);
        }}
      >
        <div ref={trackRef} className="absolute inset-y-0 left-0 will-change-transform">
          {cloneOffsets.map((cloneIndex) => (
            <div
              key={cloneIndex}
              className="absolute inset-y-0"
              style={{
                left: `${cloneIndex * stripWidth}px`,
                width: `${stripWidth}px`,
              }}
              aria-hidden={cloneIndex !== 0}
            >
              {orderedItems.map((item, itemIndex) => (
                <div
                  key={`${cloneIndex}-${item.title}`}
                  ref={(element) => {
                    cardRefs.current[(cloneIndex + 1) * orderedItems.length + itemIndex] = element;
                  }}
                  data-item-index={itemIndex}
                  data-clone-index={cloneIndex}
                  data-card-key={`${cloneIndex}-${itemIndex}`}
                  className="absolute origin-center will-change-transform transition-transform duration-300 ease-out"
                  onPointerEnter={() => {
                    hoveredCardKeyRef.current = `${cloneIndex}-${itemIndex}`;
                  }}
                  onPointerLeave={() => {
                    if (hoveredCardKeyRef.current === `${cloneIndex}-${itemIndex}`) {
                      hoveredCardKeyRef.current = null;
                    }
                  }}
                  style={{
                    left: `${itemPositions[itemIndex] ?? 0}px`,
                    top: `${topPadding + tallestHeight - (itemHeights[itemIndex] ?? tallestHeight)}px`,
                    width: `${itemWidths[itemIndex] ?? 72}px`,
                    height: `${itemHeights[itemIndex] ?? tallestHeight}px`,
                  }}
                >
                  <div className="h-full overflow-hidden bg-[#1E1E1E]">
                    <img
                      src={item.src}
                      alt={item.title}
                      className="block h-full w-full object-cover [backface-visibility:hidden]"
                      loading="lazy"
                      draggable={false}
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

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
      className={`feature-panel-shell group relative flex h-full bg-surface-900/40 backdrop-blur-sm transition-[box-shadow,background-color] duration-500 transform-gpu will-change-transform ${
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
            className={`feature-panel-media mt-8 min-h-[220px] w-full flex-1 object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.025] ${colors.glow}`}
          />
        ) : (
          <div className={`feature-panel-media mt-8 flex min-h-[220px] flex-1 items-center justify-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.025] ${colors.glow}`}>
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
  const parallaxRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(headerRef, { once: true, margin: '-80px' });
  const collageInView = useInView(collageRef, { once: true, margin: '-120px' });
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [collageHovered, setCollageHovered] = useState(false);
  const [hoveredCollageIndex, setHoveredCollageIndex] = useState<number | null>(null);
  const [collageCopyHovered, setCollageCopyHovered] = useState(false);
  const { scrollYProgress: parallaxProgress } = useScroll({
    target: parallaxRef,
    offset: ['start 88%', 'end 12%'],
  });
  const parallaxImageScale = useTransform(parallaxProgress, [0, 0.5, 1], [1.52, 1.18, 1.52]);
  const parallaxObjectY = useTransform(parallaxProgress, [0, 1], ['73%', '-11%']);
  const parallaxObjectPosition = useMotionTemplate`50% ${parallaxObjectY}`;

  return (
    <section id="features" className="relative px-6 pt-72 pb-32 md:pt-96">
      <div className="mx-auto max-w-7xl">
        <div className="relative mb-72 px-2 py-4 md:mb-[22rem] md:px-0">
          <div
            ref={collageRef}
            className="relative mx-auto aspect-square w-full max-w-[760px] md:max-w-[820px]"
            onMouseEnter={() => setCollageHovered(true)}
            onMouseLeave={() => {
              setCollageHovered(false);
              setHoveredCollageIndex(null);
            }}
          >
            <motion.div
              className="absolute inset-0 scale-[1.16] md:scale-[1.2]"
              initial={{ opacity: 0, x: -8, y: 18, scale: 0.42, rotate: -8, filter: 'blur(14px)' }}
              animate={collageInView
                ? {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    scale: 1,
                    rotate: 0,
                    filter: 'blur(0px)',
                  }
                : {}}
              transition={{
                opacity: { duration: 0.65, ease: 'easeOut' },
                x: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
                y: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
                scale: { duration: 5.8, ease: [0.16, 1, 0.3, 1] },
                rotate: { duration: 4.4, ease: [0.16, 1, 0.3, 1] },
                filter: { duration: 1.2, ease: 'easeOut' },
              }}
            >
              {collageCards.map((card, index) => {
                  const isHovered = hoveredCollageIndex === index;
                  const hoverTiltX = card.top < 50 ? 11 : -11;
                  const hoverTiltY = card.left < 50 ? -14 : 14;
                  const spiralRank = collageSpiralOrderIndex[index] ?? index;
                  const introX = (50 - card.left) * 7.8;
                  const introY = (50 - card.top) * 7.8;
                  const introScale = 0.18 + spiralRank * 0.024;
                  const introRiseY = 18 + spiralRank * 5;
                  const spiralStartRotate = -96 - spiralRank * 18;
                  const introDelay = 0.08 + spiralRank * 0.11;

                  return (
                    <motion.div
                      key={`${card.alt}-${index}`}
                      className="absolute"
                      style={{
                        left: `${card.left}%`,
                        top: `${card.top}%`,
                        width: `${card.size}%`,
                        transformOrigin: `${((50 - card.left) / card.size) * 100}% ${((50 - card.top) / card.size) * 100}%`,
                        zIndex: hoveredCollageIndex === index ? 40 : 20 + (collageCards.length - spiralRank),
                      }}
                      initial={{
                        opacity: 0.04,
                        x: introX,
                        y: introY + introRiseY,
                        scale: introScale,
                        rotate: spiralStartRotate,
                      }}
                      animate={collageInView ? {
                        opacity: 1,
                        x: 0,
                        y: 0,
                        scale: 1,
                        rotate: 0,
                      } : {}}
                      transition={{
                        opacity: { duration: 0.78, delay: introDelay, ease: [0.22, 1, 0.36, 1] },
                        x: { duration: 1.95, delay: introDelay, ease: [0.22, 1, 0.36, 1] },
                        y: { duration: 1.95, delay: introDelay, ease: [0.22, 1, 0.36, 1] },
                        scale: { duration: 4.35, delay: introDelay, ease: [0.22, 1, 0.36, 1] },
                        rotate: { duration: 2.2, delay: introDelay, ease: [0.22, 1, 0.36, 1] },
                      }}
                    >
                      <motion.div
                        className="collage-card-shell overflow-hidden rounded-[24px] bg-[#1B1B1B] shadow-[0_18px_40px_rgba(0,0,0,0.18)]"
                        initial={{ rotate: 0 }}
                        onMouseEnter={() => setHoveredCollageIndex(index)}
                        onMouseLeave={() => setHoveredCollageIndex((current) => (current === index ? null : current))}
                        animate={collageHovered ? {
                          x: card.scatter.x,
                          y: card.scatter.y,
                          rotate: card.angle + card.scatter.rotate,
                          scale: isHovered ? 1.12 : 1.03,
                          rotateX: isHovered ? hoverTiltX : 0,
                          rotateY: isHovered ? hoverTiltY : 0,
                        } : {
                          x: 0,
                          y: 0,
                          rotate: collageInView ? card.angle : 0,
                          scale: isHovered ? 1.08 : 1,
                          rotateX: isHovered ? hoverTiltX * 0.7 : 0,
                          rotateY: isHovered ? hoverTiltY * 0.7 : 0,
                        }}
                        transition={{
                          rotate: collageHovered
                            ? { type: 'spring', stiffness: 180, damping: 18, mass: 0.9 }
                            : collageInView
                              ? { duration: 0.65, ease: [0.22, 1, 0.36, 1] }
                              : { duration: 0.45, ease: 'easeOut' },
                          x: { type: 'spring', stiffness: 180, damping: 18, mass: 0.9, delay: collageHovered ? index * 0.02 : 0 },
                          y: { type: 'spring', stiffness: 180, damping: 18, mass: 0.9, delay: collageHovered ? index * 0.02 : 0 },
                          scale: { type: 'spring', stiffness: 180, damping: 18, mass: 0.9, delay: collageHovered ? index * 0.02 : 0 },
                          rotateX: { type: 'spring', stiffness: 210, damping: 20, mass: 0.85 },
                          rotateY: { type: 'spring', stiffness: 210, damping: 20, mass: 0.85 },
                        }}
                        style={{ transformPerspective: 1200, transformStyle: 'preserve-3d' }}
                      >
                        <div className="relative aspect-square w-full bg-[#1B1B1B]">
                          <img
                            src={card.imageSrc}
                            alt={card.alt}
                            className="h-full w-full object-contain transition-transform duration-500"
                            loading="lazy"
                            draggable={false}
                          />
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
            </motion.div>

            <motion.div
              className="absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 text-center"
              initial={{ opacity: 0, y: 36, filter: 'blur(10px)' }}
              animate={collageInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
              transition={{ duration: 0.54, delay: 2.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                animate={collageCopyHovered
                  ? { opacity: 0.12, y: -4, scale: 0.992, filter: 'blur(6px)' }
                  : { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.32, ease: 'easeOut' }}
              >
                <InteractiveTitle
                  src={toAssetPath('/assets/creativeAI.svg')}
                  alt="Creative AI"
                  className="mx-auto h-[42px] w-auto object-contain sm:h-[54px] md:h-[72px]"
                />
              </motion.div>
              <motion.a
                href="#more-gallery"
                className="group mt-6 inline-flex min-h-[46px] items-center gap-2 rounded-full border border-white/75 bg-white px-6 py-2 text-[13px] font-medium text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/92"
                initial={{ opacity: 0, y: 18 }}
                animate={collageInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.38, delay: 2.46, ease: [0.22, 1, 0.36, 1] }}
              >
                <span>查看更多</span>
                <span className="inline-flex items-center justify-center text-black">
                  <ChevronRight size={16} strokeWidth={2.2} />
                </span>
              </motion.a>
            </motion.div>
          </div>
        </div>

        <div ref={parallaxRef} className="relative mt-[32rem] mb-48 w-full md:mt-[44rem] md:mb-52">
          <div className="absolute top-[-10rem] left-1/2 w-screen -translate-x-1/2 md:top-[-12rem]">
            <div className="flex justify-end px-6 md:px-10">
              <motion.div
                className="text-right text-[2rem] font-medium uppercase leading-[0.88] tracking-[-0.06em] text-[#F2F0E8] md:text-[5.2rem]"
                initial="rest"
                whileHover="hover"
              >
                <motion.p
                  className="origin-right"
                  variants={headingLineVariants}
                  custom={0}
                  transition={{ type: 'spring', stiffness: 220, damping: 18, mass: 0.9 }}
                >
                  D<span className="text-[#9CFF3F]">E</span>signer
                </motion.p>
                <motion.p
                  className="origin-right"
                  variants={headingLineVariants}
                  custom={2}
                  transition={{ type: 'spring', stiffness: 220, damping: 18, mass: 0.9, delay: 0.03 }}
                >
                  WORD<span className="text-[#9CFF3F]">S</span>.
                </motion.p>
              </motion.div>
            </div>
          </div>
          <div className="mt-28 mb-6 flex justify-center text-white/72 md:mt-32 md:mb-8" aria-hidden="true">
            <ChevronDown size={28} strokeWidth={1.9} />
          </div>
          <motion.div
            className="mx-auto mb-8 flex max-w-5xl flex-col items-center gap-3 text-center text-[11px] leading-[1.9] text-surface-500 transition-[transform,color] duration-300 ease-out hover:text-surface-300 md:mb-10 md:text-[15px]"
            onHoverStart={() => setCollageCopyHovered(true)}
            onHoverEnd={() => setCollageCopyHovered(false)}
            whileHover={{ scale: 1.3 }}
            transition={{ type: 'spring', stiffness: 220, damping: 18 }}
          >
            <p>
              我是陆78，这里是一处仍在生长中的实验现场，让技术成为放大 imagination 的引擎，而不是替代判断与感受力的答案
            </p>
            <p>
              我更关心 AI 如何参与创作、触发偏离、制造新秩序，这里是一些正在生长中的方向，而不是被固定下来的结论
            </p>
          </motion.div>
          <motion.div
            className="relative left-1/2 h-[390px] w-screen -translate-x-1/2 overflow-hidden bg-[#080809] md:h-[540px]"
          >
            <motion.img
              src={parallaxPanelImage}
              alt="Parallax cover"
              className="absolute inset-0 h-full w-full object-cover will-change-transform"
              style={{
                scale: parallaxImageScale,
                objectPosition: parallaxObjectPosition,
              }}
            />
          </motion.div>
        </div>

        <RecentWorksLoop />

        <div ref={headerRef} className="mx-auto mb-16 max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 42, filter: 'blur(10px)' }}
            animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.65, delay: 0.08 }}
          >
            <InteractiveTitle
              src={toAssetPath('/assets/creative-work-title.svg')}
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

        <div id="features-grid" className="grid grid-cols-1 gap-5 md:grid-cols-2">
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
