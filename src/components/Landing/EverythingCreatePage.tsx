import { useState, useEffect, useCallback, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  animate,
  type MotionValue,
} from 'framer-motion';

const BASE = import.meta.env.BASE_URL ?? '/';
const toAsset = (p: string) => `${BASE.replace(/\/$/, '')}${p}`;

const _RAW = Array.from({ length: 16 }, (_, i) =>
  toAsset(`/assets/everything-create/${String(i + 1).padStart(2, '0')}.webp`),
);
const SHUFFLE = [9, 3, 14, 1, 7, 12, 5, 16, 2, 11, 6, 15, 4, 8, 13, 10];
const IMAGES = SHUFFLE.map((n) => _RAW[n - 1] as string);

const STACK_SIZE = 6;
const SCALE_STEP = 0.17;
const PEEK_PX = 52;
const CARD_REF_PX = 626;
const WHEEL_THROTTLE_MS = 650;
const MAX_TILT = 12; // degrees

const getScale = (pos: number) => Math.pow(1 - SCALE_STEP, pos);
const getTranslateY = (pos: number): number => {
  if (pos <= 0) return 0;
  let y = 0;
  for (let i = 1; i <= pos; i++) {
    y -= CARD_REF_PX * getScale(i - 1) * SCALE_STEP / 2 + PEEK_PX;
  }
  return y;
};

const scaleContinuous = (pos: number) => Math.pow(1 - SCALE_STEP, pos);
const stepAtPos = (p: number) => CARD_REF_PX * scaleContinuous(p) * SCALE_STEP / 2 + PEEK_PX;
const yContinuous = (pos: number): number => {
  if (pos <= 0) return stepAtPos(0) * pos;
  const floor = Math.floor(pos);
  const frac = pos - floor;
  return getTranslateY(floor) + (getTranslateY(floor + 1) - getTranslateY(floor)) * frac;
};
const darknessContinuous = (pos: number) => Math.max(0, Math.min(0.72, pos * 0.18));

// ── Single card with travel + dragon-dance hover ──────────────────────────────
function CardInStack({
  imgIdx,
  relIdx,
  travel,
  hoverX,
  hoverY,
}: {
  imgIdx: number;
  relIdx: number;
  travel: MotionValue<number>;
  hoverX: MotionValue<number>;
  hoverY: MotionValue<number>;
}) {
  const cardSize = 'clamp(324px, 67vmin, 756px)';
  const effectivePos = useTransform(travel, (t) => relIdx + t);
  const y = useTransform(effectivePos, yContinuous);
  const scale = useTransform(effectivePos, scaleContinuous);
  const darkness = useTransform(effectivePos, darknessContinuous);
  const opacity = useTransform(effectivePos, (p) =>
    p < -0.5 ? Math.max(0, p + 1) * 2 : p > STACK_SIZE - 0.5 ? Math.max(0, STACK_SIZE - p) * 2 : 1,
  );

  // Dragon-dance tilt from chained springs
  const rotateY = useTransform(hoverX, (x) => x * MAX_TILT);
  const rotateX = useTransform(hoverY, (y_) => -y_ * MAX_TILT);

  return (
    <motion.div
      className="absolute overflow-hidden"
      style={{
        zIndex: STACK_SIZE - relIdx + 1,
        width: cardSize,
        height: cardSize,
        left: 'calc(clamp(324px, 67vmin, 756px) * -0.5)',
        top: 'calc(clamp(324px, 67vmin, 756px) * -0.5)',
        borderRadius: 'clamp(32px, 5vw, 64px)',
        boxShadow:
          relIdx === 0
            ? '0 40px 100px rgba(0,0,0,0.85), 0 8px 24px rgba(0,0,0,0.5)'
            : '0 16px 50px rgba(0,0,0,0.55)',
        y,
        scale,
        opacity,
        rotateX,
        rotateY,
      }}
    >
      <img
        src={IMAGES[imgIdx]}
        alt={`Work ${imgIdx + 1}`}
        className="h-full w-full object-cover"
        draggable={false}
      />
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'black', opacity: darkness }}
      />
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function EverythingCreatePage() {
  const [startIdx, setStartIdx] = useState(0);
  const [extraCard, setExtraCard] = useState<{ imgIdx: number; relIdx: number } | null>(null);
  // Responsive vertical offset: ensures back card stays within viewport
  const [stackOffset, setStackOffset] = useState(50);

  useEffect(() => {
    const compute = () => {
      const vmin = Math.min(window.innerWidth, window.innerHeight);
      const cardSize = Math.min(Math.max(324, 0.67 * vmin), 756);
      const backScale = Math.pow(1 - SCALE_STEP, STACK_SIZE - 1);
      const backCardHalf = (cardSize * backScale) / 2;
      const backCardY = getTranslateY(STACK_SIZE - 1); // negative value
      // Min offset = distance needed to keep back card >= 20px from viewport top
      const minOffset = 20 - backCardY - backCardHalf - window.innerHeight / 2;
      setStackOffset(Math.max(50, Math.ceil(minOffset)));
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  const travel = useMotionValue(0);
  const animating = useRef(false);
  const lastWheelTime = useRef(0);

  // ── Dragon-dance: raw mouse → 6 chained springs ───────────────────────────
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  // Each spring follows the previous one → creates the trailing wave
  const hX0 = useSpring(rawX,  { stiffness: 420, damping: 42 });
  const hY0 = useSpring(rawY,  { stiffness: 420, damping: 42 });
  const hX1 = useSpring(hX0,   { stiffness: 280, damping: 38 });
  const hY1 = useSpring(hY0,   { stiffness: 280, damping: 38 });
  const hX2 = useSpring(hX1,   { stiffness: 190, damping: 34 });
  const hY2 = useSpring(hY1,   { stiffness: 190, damping: 34 });
  const hX3 = useSpring(hX2,   { stiffness: 130, damping: 30 });
  const hY3 = useSpring(hY2,   { stiffness: 130, damping: 30 });
  const hX4 = useSpring(hX3,   { stiffness: 88,  damping: 26 });
  const hY4 = useSpring(hY3,   { stiffness: 88,  damping: 26 });
  const hX5 = useSpring(hX4,   { stiffness: 58,  damping: 22 });
  const hY5 = useSpring(hY4,   { stiffness: 58,  damping: 22 });

  const hoverSprings = [
    { x: hX0, y: hY0 },
    { x: hX1, y: hY1 },
    { x: hX2, y: hY2 },
    { x: hX3, y: hY3 },
    { x: hX4, y: hY4 },
    { x: hX5, y: hY5 },
  ] as const;

  const getHoverForRelIdx = (relIdx: number) =>
    hoverSprings[Math.max(0, Math.min(STACK_SIZE - 1, relIdx))]!;

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawX.set((e.clientX / window.innerWidth  - 0.5) * 2);
      rawY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    const onLeave = () => { rawX.set(0); rawY.set(0); };
    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [rawX, rawY]);

  // ── Navigation ────────────────────────────────────────────────────────────
  const navigate = useCallback(
    (d: 1 | -1) => {
      if (animating.current) return;
      animating.current = true;
      const extra =
        d > 0
          ? { imgIdx: (startIdx + STACK_SIZE) % IMAGES.length, relIdx: STACK_SIZE }
          : { imgIdx: (startIdx - 1 + IMAGES.length) % IMAGES.length, relIdx: -1 };
      setExtraCard(extra);
      animate(travel, d > 0 ? -1 : 1, {
        type: 'spring',
        stiffness: 230,
        damping: 32,
        restDelta: 0.003,
        onComplete: () => {
          setStartIdx((prev) => (prev + d + IMAGES.length) % IMAGES.length);
          travel.set(0);
          setExtraCard(null);
          animating.current = false;
        },
      });
    },
    [startIdx, travel],
  );

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastWheelTime.current < WHEEL_THROTTLE_MS) return;
      lastWheelTime.current = now;
      if (e.deltaY > 0) navigate(1);
      else if (e.deltaY < 0) navigate(-1);
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [navigate]);

  const touchStart = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => {
    const onStart = (e: TouchEvent) => {
      touchStart.current = { x: e.touches[0]?.clientX ?? 0, y: e.touches[0]?.clientY ?? 0 };
    };
    const onEnd = (e: TouchEvent) => {
      if (!touchStart.current) return;
      const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStart.current.x;
      const dy = (e.changedTouches[0]?.clientY ?? 0) - touchStart.current.y;
      touchStart.current = null;
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 40) navigate(dy < 0 ? 1 : -1);
      else if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) navigate(dx < 0 ? 1 : -1);
    };
    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchend', onEnd, { passive: true });
    return () => { window.removeEventListener('touchstart', onStart); window.removeEventListener('touchend', onEnd); };
  }, [navigate]);

  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const dragged = useRef(false);
  useEffect(() => {
    const onDown = (e: MouseEvent) => { if (e.button !== 0) return; dragStart.current = { x: e.clientX, y: e.clientY }; dragged.current = false; };
    const onMove = (e: MouseEvent) => {
      if (!dragStart.current) return;
      if (Math.abs(e.clientX - dragStart.current.x) > 6 || Math.abs(e.clientY - dragStart.current.y) > 6) dragged.current = true;
    };
    const onUp = (e: MouseEvent) => {
      if (e.button !== 0 || !dragStart.current) return;
      if (dragged.current) {
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 40) navigate(dy < 0 ? 1 : -1);
        else if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) navigate(dx < 0 ? 1 : -1);
      }
      dragStart.current = null; dragged.current = false;
    };
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousedown', onDown); window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [navigate]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') navigate(1);
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') navigate(-1);
      else if (e.key === 'Escape') { window.location.hash = ''; }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate]);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'auto' }); }, []);

  const cards: { imgIdx: number; relIdx: number }[] = Array.from({ length: STACK_SIZE }, (_, i) => ({
    imgIdx: (startIdx + i) % IMAGES.length,
    relIdx: i,
  }));
  if (extraCard) {
    if (extraCard.relIdx === STACK_SIZE) cards.push(extraCard);
    else cards.unshift(extraCard);
  }

  return (
    <div className="fixed inset-0 z-40 overflow-hidden bg-black cursor-grab active:cursor-grabbing select-none">
      <div className="absolute inset-0 flex items-center justify-center">
        {/* perspective enables 3D tilt from rotateX/Y */}
        <div
          className="relative"
          style={{ width: 0, height: 0, transform: `translateY(${stackOffset}px)`, perspective: '1000px' }}
        >
          {[...cards].reverse().map(({ imgIdx, relIdx }) => {
            const { x: hoverX, y: hoverY } = getHoverForRelIdx(relIdx);
            return (
              <CardInStack
                key={imgIdx}
                imgIdx={imgIdx}
                relIdx={relIdx}
                travel={travel}
                hoverX={hoverX}
                hoverY={hoverY}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
