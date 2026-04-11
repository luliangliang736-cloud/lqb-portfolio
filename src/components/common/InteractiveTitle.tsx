import { type MouseEvent, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface InteractiveTitleProps {
  src: string;
  alt: string;
  className?: string;
}

const ROTATE_RANGE = 8;
const SHIFT_RANGE = 10;

export default function InteractiveTitle({ src, alt, className = '' }: InteractiveTitleProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const springConfig = { stiffness: 220, damping: 20, mass: 0.7 };
  const smoothX = useSpring(pointerX, springConfig);
  const smoothY = useSpring(pointerY, springConfig);

  const rotateY = useTransform(smoothX, [-1, 1], [-ROTATE_RANGE, ROTATE_RANGE]);
  const rotateX = useTransform(smoothY, [-1, 1], [ROTATE_RANGE, -ROTATE_RANGE]);
  const translateX = useTransform(smoothX, [-1, 1], [-SHIFT_RANGE, SHIFT_RANGE]);
  const translateY = useTransform(smoothY, [-1, 1], [-SHIFT_RANGE + 2, SHIFT_RANGE - 2]);

  const handlePointerMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const relativeX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const relativeY = ((event.clientY - rect.top) / rect.height) * 2 - 1;

    pointerX.set(relativeX);
    pointerY.set(relativeY);
  };

  const resetPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
    setIsHovering(false);
  };

  return (
    <motion.div
      className="relative inline-block cursor-pointer [perspective:1200px]"
      onMouseEnter={() => setIsHovering(true)}
      onMouseMove={handlePointerMove}
      onMouseLeave={resetPointer}
      onClick={() => setPulseKey((current) => current + 1)}
      whileTap={{ scale: 0.985 }}
    >
      <motion.div
        key={pulseKey}
        className="relative"
        style={{
          rotateX,
          rotateY,
          x: translateX,
          y: translateY,
          transformStyle: 'preserve-3d',
        }}
        animate={pulseKey ? { scale: [1, 1.04, 0.99, 1.015, 1] } : { scale: 1 }}
        transition={{ duration: 0.52, ease: 'easeOut' }}
      >
        <motion.img
          src={src}
          alt={alt}
          className={className}
          animate={isHovering ? { scale: 1.02 } : { scale: 1 }}
          transition={{ type: 'spring', stiffness: 240, damping: 18 }}
          draggable={false}
        />
      </motion.div>
    </motion.div>
  );
}
