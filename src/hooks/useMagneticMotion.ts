import { useEffect, useState, type MouseEventHandler } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';

type UseMagneticMotionOptions = {
  strength?: number;
  stiffness?: number;
  damping?: number;
};

export function useMagneticMotion(options: UseMagneticMotionOptions = {}) {
  const { strength = 14, stiffness = 220, damping = 18 } = options;
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness, damping });
  const springY = useSpring(y, { stiffness, damping });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateEnabled = () => {
      setEnabled(finePointer.matches && !reducedMotion.matches);
    };

    updateEnabled();
    finePointer.addEventListener('change', updateEnabled);
    reducedMotion.addEventListener('change', updateEnabled);

    return () => {
      finePointer.removeEventListener('change', updateEnabled);
      reducedMotion.removeEventListener('change', updateEnabled);
    };
  }, []);

  const handleMouseMove: MouseEventHandler<HTMLElement> = (event) => {
    if (!enabled) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - rect.left - rect.width / 2;
    const offsetY = event.clientY - rect.top - rect.height / 2;

    x.set((offsetX / rect.width) * strength * 2);
    y.set((offsetY / rect.height) * strength * 2);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return {
    enabled,
    x: springX,
    y: springY,
    handleMouseMove,
    handleMouseLeave: reset,
  };
}
