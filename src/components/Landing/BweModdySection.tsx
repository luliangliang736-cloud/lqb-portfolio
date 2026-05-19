import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { toAssetPath } from '../../utils/assetPath';

const bannerSrc = toAssetPath('/assets/bwe-moddy-banner.webp');

const cards = [
  toAssetPath('/assets/bwe-moddy-cards/1.webp'),
  toAssetPath('/assets/bwe-moddy-cards/2.webp'),
  toAssetPath('/assets/bwe-moddy-cards/3.webp'),
  toAssetPath('/assets/bwe-moddy-cards/4.webp'),
];

// 单张卡片：暗/亮由 lit 控制，hover 时也会亮
function BrightCard({
  src,
  alt,
  lit,
  style,
  motionProps,
  index,
  onHoverChange,
}: {
  src: string;
  alt: string;
  lit: boolean;
  style?: React.CSSProperties;
  motionProps?: object;
  index: number;
  onHoverChange: (index: number, hovered: boolean) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const bright = lit || hovered;

  return (
    <motion.div
      className="shrink-0 overflow-hidden"
      style={style}
      onMouseEnter={() => { setHovered(true); onHoverChange(index, true); }}
      onMouseLeave={() => { setHovered(false); onHoverChange(index, false); }}
      {...motionProps}
    >
      <motion.img
        src={src}
        alt={alt}
        className="block h-full w-auto"
        loading="lazy"
        draggable={false}
        animate={{ filter: bright ? 'brightness(1)' : 'brightness(0.22)' }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      />
    </motion.div>
  );
}

export default function BweModdySection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  // activeIndex: 自动轮播当前亮起的卡片 (-1 = 无)
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  // hoveredIndex: 鼠标悬停的卡片
  const [, setHoveredIndex] = useState<number>(-1);

  const handleHoverChange = useCallback((index: number, hovered: boolean) => {
    setHoveredIndex(hovered ? index : -1);
  }, []);

  // 自动循环：每张亮1.2s，间隔0.3s后切下一张
  useEffect(() => {
    if (!isInView) return;
    let current = 0;
    setActiveIndex(0);

    const tick = () => {
      current = (current + 1) % cards.length;
      setActiveIndex(current);
    };

    const interval = setInterval(tick, 1500);
    return () => clearInterval(interval);
  }, [isInView]);

  const isLit = (i: number) => activeIndex === i;

  return (
    <section ref={ref} className="relative w-full overflow-hidden">

      {/* Bottom large image */}
      <img
        src={bannerSrc}
        alt="BWE MODDY"
        className="block w-full object-cover"
        draggable={false}
        loading="lazy"
      />

      {/* 4 cards */}
      <div
        className="absolute inset-x-0 flex items-end gap-2 pl-4 md:gap-3 md:pl-6 lg:gap-4 lg:pl-8"
        style={{ bottom: '14.06vw', zIndex: 10 }}
      >
        {/* Card 1 */}
        <BrightCard
          src={cards[0]}
          alt="卡片 1"
          lit={isLit(0)}
          index={0}
          onHoverChange={handleHoverChange}
          style={{ height: '15.625vw' }}
          motionProps={{
            initial: { opacity: 0, y: 18 },
            animate: isInView ? { opacity: 1, y: 0 } : {},
            transition: { duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] },
          }}
        />

        {/* Cards 2 + 3 — no gap, pushed right */}
        <div className="ml-auto flex items-end -translate-x-[2vw] -ml-5" style={{ gap: 0 }}>
          {[1, 2].map((i) => (
            <BrightCard
              key={cards[i]}
              src={cards[i]}
              alt={`卡片 ${i + 1}`}
              lit={isLit(i)}
              index={i}
              onHoverChange={handleHoverChange}
              style={{ height: '15.625vw', marginRight: i === 1 ? '-1px' : undefined }}
              motionProps={{
                initial: { opacity: 0, y: 18 },
                animate: isInView ? { opacity: 1, y: 0 } : {},
                transition: { duration: 0.5, delay: 0.15 + i * 0.08, ease: [0.22, 1, 0.36, 1] },
              }}
            />
          ))}
        </div>

        {/* Card 4 — flush right */}
        <BrightCard
          src={cards[3]}
          alt="卡片 4"
          lit={isLit(3)}
          index={3}
          onHoverChange={handleHoverChange}
          style={{ height: '15.625vw' }}
          motionProps={{
            initial: { opacity: 0, y: 18 },
            animate: isInView ? { opacity: 1, y: 0 } : {},
            transition: { duration: 0.5, delay: 0.39, ease: [0.22, 1, 0.36, 1] },
          }}
        />
      </div>

    </section>
  );
}
