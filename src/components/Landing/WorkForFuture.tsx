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

export default function WorkForFuture() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section
      ref={ref}
      className="relative w-full bg-black py-[250px]"
    >
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
