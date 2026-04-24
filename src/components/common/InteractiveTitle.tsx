import { type MouseEvent, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface InteractiveTitleProps {
  src: string;
  alt: string;
  className?: string;
  spinOnHover?: boolean;
}

const ROTATE_RANGE = 8;
const SHIFT_RANGE = 10;

export default function InteractiveTitle({ src, alt, className = '', spinOnHover = false }: InteractiveTitleProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);
  const [spinKey, setSpinKey] = useState(0);
  const previousPointerRef = useRef<{ x: number; y: number } | null>(null);
  const lastSpinAtRef = useRef(0);

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
    const previousPointer = previousPointerRef.current;
    const deltaX = previousPointer ? event.clientX - previousPointer.x : 0;
    const deltaY = previousPointer ? event.clientY - previousPointer.y : 0;

    pointerX.set(relativeX);
    pointerY.set(relativeY);

    if (spinOnHover && previousPointer) {
      const now = performance.now();
      const movingMostlyVertical = Math.abs(deltaY) > 9 && Math.abs(deltaY) > Math.abs(deltaX) * 1.35;

      if (movingMostlyVertical && now - lastSpinAtRef.current > 720) {
        setSpinKey((current) => current + 1);
        lastSpinAtRef.current = now;
      }
    }

    previousPointerRef.current = {
      x: event.clientX,
      y: event.clientY,
    };
  };

  const resetPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
    setIsHovering(false);
    previousPointerRef.current = null;
  };

  return (
    <motion.div
      className="relative inline-block cursor-pointer [perspective:1200px]"
      onMouseEnter={(event) => {
        setIsHovering(true);
        previousPointerRef.current = {
          x: event.clientX,
          y: event.clientY,
        };
      }}
      onMouseMove={handlePointerMove}
      onMouseLeave={resetPointer}
      onClick={() => setPulseKey((current) => current + 1)}
      whileTap={{ scale: 0.985 }}
    >
      <motion.div
        key={`spin-${spinKey}`}
        className="relative"
        initial={{ rotateX: 0 }}
        animate={{ rotateX: spinOnHover && spinKey ? 360 : 0 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformStyle: 'preserve-3d' }}
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
    </motion.div>
  );
}
