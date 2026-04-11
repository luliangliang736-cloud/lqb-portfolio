import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { useTransparentImage } from '../../hooks/useTransparentImage';

type Expression = 'idle' | 'blink' | 'nod' | 'smile' | 'wave';

const SPEECH_BUBBLES = [
  '你好呀！',
  '需要我帮忙设计吗？',
  '点我试试～',
  '我是 LQB！',
  '有什么设计需求？',
];

export default function InteractiveCharacter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const characterSrc = useTransparentImage('/assets/character.png', 35);
  const [expression, setExpression] = useState<Expression>('idle');
  const [bubble, setBubble] = useState<string | null>(null);
  const [clickCount, setClickCount] = useState(0);
  const bubbleTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-12, 12]);
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [8, -8]);
  const glowX = useTransform(smoothX, [-0.5, 0.5], [-30, 30]);
  const glowY = useTransform(smoothY, [-0.5, 0.5], [-20, 20]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const playExpression = useCallback((expr: Expression, durationMs: number) => {
    setExpression(expr);
    setTimeout(() => setExpression('idle'), durationMs);
  }, []);

  const showBubble = useCallback((text: string) => {
    if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
    setBubble(text);
    bubbleTimer.current = setTimeout(() => setBubble(null), 2500);
  }, []);

  const handleClick = useCallback(() => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    const actions: [Expression, number][] = [
      ['blink', 400],
      ['nod', 600],
      ['smile', 800],
      ['wave', 700],
    ];
    const [expr, dur] = actions[newCount % actions.length];
    playExpression(expr, dur);
    showBubble(SPEECH_BUBBLES[newCount % SPEECH_BUBBLES.length]);
  }, [clickCount, playExpression, showBubble]);

  // auto-blink every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (expression === 'idle') {
        playExpression('blink', 300);
      }
    }, 3500 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, [expression, playExpression]);

  const getExpressionTransform = () => {
    switch (expression) {
      case 'blink':
        return { scaleY: [1, 0.92, 1], transition: { duration: 0.3, times: [0, 0.4, 1] } };
      case 'nod':
        return { y: [0, 8, -2, 0], rotateX: [0, 3, -1, 0], transition: { duration: 0.6 } };
      case 'smile':
        return { scale: [1, 1.04, 1.02], y: [0, -3, -1], transition: { duration: 0.8, ease: 'easeOut' as const } };
      case 'wave':
        return { rotate: [0, -3, 3, -2, 0], transition: { duration: 0.7 } };
      default:
        return {};
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-[320px] h-[320px] md:w-[420px] md:h-[420px] lg:w-[480px] lg:h-[480px] cursor-pointer select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{ perspective: 800 }}
    >
      {/* Dynamic glow that follows mouse */}
      <motion.div
        className="absolute inset-0 rounded-full bg-primary-500/12 blur-3xl scale-125 pointer-events-none"
        style={{ x: glowX, y: glowY }}
      />
      <motion.div
        className="absolute inset-0 rounded-full bg-violet-500/8 blur-[60px] scale-110 pointer-events-none"
        style={{ x: useTransform(glowX, v => -v * 0.5), y: useTransform(glowY, v => -v * 0.5) }}
      />

      {/* 3D tilt container */}
      <motion.div
        className="relative w-full h-full"
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      >
        {/* Character image */}
        <motion.div
          className="w-full h-full"
          animate={getExpressionTransform()}
        >
          {characterSrc ? (
            <img
              src={characterSrc}
              alt="LQB - 设计部0号员工"
              draggable={false}
              className="w-full h-full object-contain drop-shadow-[0_0_60px_rgba(124,106,255,0.2)]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border-2 border-primary-400 border-t-transparent animate-spin" />
            </div>
          )}
        </motion.div>

        {/* Floating particles that react to hover */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-primary-400/40 pointer-events-none"
            style={{
              left: `${20 + (i * 12) % 60}%`,
              top: `${15 + (i * 17) % 70}%`,
            }}
            animate={{
              y: [0, -12 - i * 3, 0],
              x: [0, (i % 2 === 0 ? 6 : -6), 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2.5 + i * 0.4,
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'easeInOut',
            }}
          />
        ))}
      </motion.div>

      {/* Speech bubble */}
      <AnimatePresence>
        {bubble && (
          <motion.div
            className="absolute -top-2 right-0 md:-right-4 z-10"
            initial={{ opacity: 0, scale: 0.7, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -5 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            <div className="relative bg-white text-surface-900 text-sm font-medium px-4 py-2 rounded-2xl rounded-bl-md shadow-xl shadow-black/20">
              {bubble}
              {/* Tail */}
              <div className="absolute -bottom-1.5 left-4 w-3 h-3 bg-white rotate-45" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hover hint */}
      <motion.div
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <motion.span
          className="text-xs text-surface-500"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          点击互动
        </motion.span>
      </motion.div>
    </div>
  );
}
