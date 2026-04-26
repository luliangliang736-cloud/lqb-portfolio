import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const headingLineVariants = {
  rest: {
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
  },
  hover: {
    x: 18,
    y: -8,
    rotate: -1.2,
    scale: 1.02,
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
    ];

    return layouts[index] ?? layouts[0];
  },
};

function renderHeadingWithAccentIndexes(
  heading: string,
  accentIndexes: number[],
  accentColorClass = 'text-[#9CFF3F]',
  keyPrefix = heading,
) {
  const accentIndexSet = new Set(accentIndexes);
  let wordIndex = 0;
  let charIndexAcrossWords = 0;

  return heading.split(' ').map((word, index, words) => {
    const currentWordIndex = wordIndex;
    wordIndex += 1;

    return (
      <motion.span
        key={`${keyPrefix}-${word}-${index}`}
        className="inline-block"
        variants={headingWordVariants}
        custom={currentWordIndex}
        transition={{ type: 'spring', stiffness: 260, damping: 18, mass: 0.8, delay: currentWordIndex * 0.02 }}
      >
        {word.split('').map((char, charIndex) => {
          const shouldAccent = accentIndexSet.has(charIndexAcrossWords);
          charIndexAcrossWords += 1;

          return (
            <span key={`${keyPrefix}-${word}-${char}-${charIndex}`} className={shouldAccent ? accentColorClass : undefined}>
              {char}
            </span>
          );
        })}
        {index < words.length - 1 ? <span className="inline-block w-[0.22em]" aria-hidden="true" /> : null}
      </motion.span>
    );
  });
}

export default function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="relative px-5 pt-20 pb-16 sm:px-6 sm:pt-24 sm:pb-20 lg:pt-28 lg:pb-22 xl:pt-32 xl:pb-24" ref={ref}>
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 h-[280px] w-[420px] -translate-x-1/2 rounded-full bg-primary-600/8 blur-[90px] sm:h-[340px] sm:w-[520px] lg:h-[380px] lg:w-[560px] xl:h-[400px] xl:w-[600px] xl:blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-6xl text-center">
        <motion.div
          className="mx-auto -translate-y-6 flex w-full justify-center px-1 text-center sm:-translate-y-8 lg:-translate-y-10"
          initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
          animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.65 }}
          whileHover="hover"
          variants={{ rest: {}, hover: {} }}
        >
          <div className="max-w-[980px]">
            <motion.p
              className="whitespace-nowrap text-[1.95rem] font-medium uppercase leading-[0.9] tracking-[-0.08em] text-[#F2F0E8] sm:text-[2.5rem] lg:text-[4.6rem] xl:text-[5.8rem]"
              variants={headingLineVariants}
              transition={{ type: 'spring', stiffness: 220, damping: 18, mass: 0.9 }}
            >
              {renderHeadingWithAccentIndexes('STOP OVERTHINKING', [2], 'text-[#FFB8DF]', 'cta-quote-line-1')}
            </motion.p>
            <motion.p
              className="mt-2 text-[1.95rem] font-medium uppercase leading-[0.9] tracking-[-0.08em] text-[#F2F0E8] sm:text-[2.5rem] lg:text-[4.6rem] xl:text-[5.8rem]"
              variants={headingLineVariants}
              transition={{ type: 'spring', stiffness: 220, damping: 18, mass: 0.9 }}
            >
              {renderHeadingWithAccentIndexes('JUST DO IT', [6], 'text-[#9CFF3F]', 'cta-quote-line-2')}
            </motion.p>
            <motion.p
              className="mt-2 text-[1.95rem] font-medium uppercase leading-[0.9] tracking-[-0.08em] text-white/72 sm:text-[2.5rem] lg:text-[4.6rem] xl:text-[5.8rem]"
              variants={headingLineVariants}
              transition={{ type: 'spring', stiffness: 220, damping: 18, mass: 0.9 }}
            >
              {renderHeadingWithAccentIndexes('FOR FUTURE', [], 'text-[#9CFF3F]', 'cta-quote-line-3')}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
