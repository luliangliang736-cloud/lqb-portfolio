import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

const BASE = import.meta.env.BASE_URL ?? '/';
const toAsset = (p: string) => `${BASE.replace(/\/$/, '')}${p}`;

const CARD_IMAGES: string[][] = [
  [
    toAsset('/assets/scroll-cards/Mask group.webp'),
    toAsset('/assets/scroll-cards/Mask group-1.webp'),
    toAsset('/assets/scroll-cards/Mask group-2.webp'),
    toAsset('/assets/scroll-cards/Mask group-3.webp'),
    toAsset('/assets/scroll-cards/Mask group-4.webp'),
  ],
  [
    toAsset('/assets/scroll-cards/Mask group-5.webp'),
    toAsset('/assets/scroll-cards/Mask group-6.webp'),
    toAsset('/assets/scroll-cards/Mask group-7.webp'),
    toAsset('/assets/scroll-cards/Mask group-8.webp'),
    toAsset('/assets/scroll-cards/Mask group-9.webp'),
  ],
  [
    toAsset('/assets/scroll-cards/Mask group-10.webp'),
    toAsset('/assets/scroll-cards/Mask group-11.webp'),
    toAsset('/assets/scroll-cards/Mask group-12.webp'),
    toAsset('/assets/scroll-cards/Mask group-13.webp'),
    toAsset('/assets/scroll-cards/Mask group-14.webp'),
  ],
];

const SHOWCASE_FLOATS = [
  {
    src: toAsset('/assets/work-future-showcase/1.webp'),
    className: 'left-[3vw] top-[9.5vw] aspect-[3/4] w-[9.5vw]',
  },
  {
    src: toAsset('/assets/work-future-showcase/2.webp'),
    className: 'bottom-[6.2vw] left-[16vw] aspect-[16/9] w-[22vw]',
  },
  {
    src: toAsset('/assets/work-future-showcase/3.webp'),
    className: 'right-[21vw] top-[4.5vw] aspect-[3/4] w-[15vw]',
  },
  {
    src: toAsset('/assets/work-future-showcase/4.webp'),
    className: 'bottom-[9vw] right-[4vw] aspect-[3/4] w-[12vw]',
  },
];

const headingLineVariants = {
  rest: { x: 0, y: 0, rotate: 0, scale: 1 },
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
  rest: { x: 0, y: 0, rotate: 0, scale: 1 },
  hover: (index: number) => {
    const layouts = [
      { x: -12, y: -8, rotate: -2.2, scale: 1.02 },
      { x: 16, y: 8, rotate: 1.4, scale: 0.985 },
      { x: -8, y: 12, rotate: -1.2, scale: 1.01 },
      { x: 14, y: -10, rotate: 2, scale: 1.03 },
      { x: -16, y: 6, rotate: -1.6, scale: 0.99 },
    ];
    return layouts[index] ?? layouts[0];
  },
};

function SlidingCard({ images, delay = 0 }: { images: string[]; delay?: number }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % images.length);
      }, 3000);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [images.length, delay]);

  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: '3/4' }}>
      <AnimatePresence initial={false}>
        <motion.img
          key={index}
          src={images[index]}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
          loading="lazy"
          initial={{ y: '100%' }}
          animate={{ y: '0%' }}
          exit={{ y: '-100%' }}
          transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
        />
      </AnimatePresence>
    </div>
  );
}

const showcaseWordOffsets = {
  EVERYTHING: 0,
  TO: 10,
  CREATE: 12,
  ANYTHING: 18,
};

const showcaseAccentMap = new Map<number, string>([
  [showcaseWordOffsets.EVERYTHING + 5, '#9CFF3F'], // H in EVERYTHING
  [showcaseWordOffsets.CREATE + 4, '#FFB8DF'], // T in CREATE
  [showcaseWordOffsets.ANYTHING + 6, '#9CFF3F'], // second N in ANYTHING
]);

function AccentLetters({
  word,
  offset,
  accents,
}: {
  word: string;
  offset: number;
  accents: Map<number, string>;
}) {
  return (
    <>
      {word.split('').map((letter, index) => {
        const color = accents.get(offset + index);
        return (
          <span key={`${word}-${index}`} style={color ? { color } : undefined}>
            {letter}
          </span>
        );
      })}
    </>
  );
}

function WorkFutureShowcase({ isInView }: { isInView: boolean }) {
  return (
    <motion.div
      className="relative left-1/2 mb-52 hidden h-[56.25vw] w-screen -translate-x-1/2 -translate-y-[244px] overflow-hidden md:block"
      initial={{ opacity: 0, y: 36 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {SHOWCASE_FLOATS.map((item, index) => (
        <motion.div
          key={index}
          className={`absolute z-10 overflow-hidden shadow-[0_24px_70px_rgba(0,0,0,0.35)] ${item.className}`}
          initial={{ opacity: 0, y: 26, scale: 0.94 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          whileHover={{
            y: -12,
            scale: 1.08,
            rotateX: item.className.includes('top') ? 8 : -8,
            rotateY: item.className.includes('left') ? -10 : 10,
            filter: 'brightness(1.1)',
          }}
          transition={{
            opacity: { duration: 0.72, delay: 0.12 + index * 0.08, ease: [0.22, 1, 0.36, 1] },
            y: { type: 'spring', stiffness: 420, damping: 24, mass: 0.65 },
            scale: { type: 'spring', stiffness: 420, damping: 24, mass: 0.65 },
            rotateX: { type: 'spring', stiffness: 420, damping: 24, mass: 0.65 },
            rotateY: { type: 'spring', stiffness: 420, damping: 24, mass: 0.65 },
            filter: { duration: 0.16, ease: 'easeOut' },
          }}
          style={{ transformPerspective: 900, transformStyle: 'preserve-3d' }}
        >
          <img
            src={item.src}
            alt=""
            className="h-full w-full object-contain"
            draggable={false}
            loading="lazy"
          />
        </motion.div>
      ))}

      <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center text-center">
        <motion.div
          className="pointer-events-auto relative cursor-default"
          initial="rest"
          whileHover="hover"
        >
          <motion.h3
            className="text-[1.95rem] font-medium uppercase leading-[0.9] tracking-[-0.08em] text-[#F2F0E8] sm:text-[2.5rem] lg:text-[4.6rem] xl:text-[5.8rem]"
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.85, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
        >
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
                  <AccentLetters
                    word="EVERYTHING"
                    offset={showcaseWordOffsets.EVERYTHING}
                    accents={showcaseAccentMap}
                  />
                </motion.span>
              </motion.span>
            </span>

            <span className="mt-2 block">
              <motion.span
                className="inline-flex origin-center items-center justify-center gap-[0.18em] lg:gap-[0.22em]"
                variants={headingLineVariants}
                custom={1}
                transition={{ type: 'spring', stiffness: 220, damping: 18, mass: 0.9, delay: 0.02 }}
              >
                <motion.span
                  className="inline-block"
                  variants={headingWordVariants}
                  custom={1}
                  transition={{ type: 'spring', stiffness: 260, damping: 18, mass: 0.8 }}
                >
                  <AccentLetters word="TO" offset={showcaseWordOffsets.TO} accents={showcaseAccentMap} />
                </motion.span>
                <motion.span
                  className="inline-flex items-center rounded-full bg-[#9CFF3F] px-[0.42em] py-[0.12em] align-middle text-[0.46em] leading-none tracking-[-0.04em] text-black"
                  variants={headingWordVariants}
                  custom={2}
                  transition={{ type: 'spring', stiffness: 260, damping: 18, mass: 0.8, delay: 0.02 }}
                >
                  Enert
                </motion.span>
                <motion.span
                  className="inline-block"
                  variants={headingWordVariants}
                  custom={3}
                  transition={{ type: 'spring', stiffness: 260, damping: 18, mass: 0.8, delay: 0.03 }}
                >
                  <AccentLetters
                    word="CREATE"
                    offset={showcaseWordOffsets.CREATE}
                    accents={showcaseAccentMap}
                  />
                </motion.span>
              </motion.span>
            </span>

            <span className="mt-2 block">
              <motion.span
                className="inline-block origin-left"
                variants={headingLineVariants}
                custom={2}
                transition={{ type: 'spring', stiffness: 220, damping: 18, mass: 0.9, delay: 0.04 }}
              >
                <motion.span
                  className="inline-block"
                  variants={headingWordVariants}
                  custom={4}
                  transition={{ type: 'spring', stiffness: 260, damping: 18, mass: 0.8, delay: 0.04 }}
                >
                  <AccentLetters
                    word="ANYTHING"
                    offset={showcaseWordOffsets.ANYTHING}
                    accents={showcaseAccentMap}
                  />
                </motion.span>
              </motion.span>
            </span>
          </motion.h3>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function WorkForFuture() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section
      ref={ref}
      className="relative w-full bg-black py-[250px]"
    >
      <WorkFutureShowcase isInView={isInView} />

      <div className="flex pb-16 lg:pb-24" style={{ transform: 'translateY(-200px)', marginBottom: '-200px' }}>

        {/* Left — text block with hover effect */}
        <div className="flex flex-1 items-center px-5 sm:px-6 lg:px-8 xl:px-10">
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="relative cursor-default"
              initial="rest"
              whileHover="hover"
            >
              <h2 className="text-[1.95rem] font-medium uppercase leading-[0.9] tracking-[-0.08em] text-[#F2F0E8] sm:text-[2.5rem] lg:text-[4.6rem] xl:text-[5.8rem]">
                {/* Line 1: WORK */}
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
                      WORK
                    </motion.span>
                  </motion.span>
                </span>

                {/* Line 2: A FUTURE */}
                <span className="mt-2 block">
                  <motion.span
                    className="inline-flex origin-left items-baseline gap-[0.22em] lg:gap-[0.28em]"
                    variants={headingLineVariants}
                    custom={1}
                    transition={{ type: 'spring', stiffness: 220, damping: 18, mass: 0.9, delay: 0.02 }}
                  >
                    <motion.span
                      className="inline-block"
                      variants={headingWordVariants}
                      custom={1}
                      transition={{ type: 'spring', stiffness: 260, damping: 18, mass: 0.8 }}
                    >
                      A
                    </motion.span>
                    <motion.span
                      className="inline-block"
                      variants={headingWordVariants}
                      custom={2}
                      transition={{ type: 'spring', stiffness: 260, damping: 18, mass: 0.8, delay: 0.02 }}
                    >
                      <span className="text-[#9CFF3F]">FU</span>TURE
                    </motion.span>
                  </motion.span>
                </span>
              </h2>
            </motion.div>
          </motion.div>
        </div>

        {/* Right — 3 cards */}
        <div className="flex w-[42%] max-w-[420px] shrink-0 flex-col justify-center gap-4 py-12 pr-8 md:pr-12 lg:pr-16">
          {CARD_IMAGES.map((imgs, i) => (
            <motion.div
              key={i}
              className="w-full overflow-hidden"
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.55,
                delay: 0.1 + i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <SlidingCard images={imgs} delay={i * 400} />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
