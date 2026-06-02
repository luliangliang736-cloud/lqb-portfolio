import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from 'react';

// ─── Config ──────────────────────────────────────────────────────────────────
const GAP = 8;            // px gap between cards
const ROWS = 12;           // rows per loop-set
const AUTO_SPEED = 0.5;   // px/frame auto-scroll (upward)

// ─── Helpers ─────────────────────────────────────────────────────────────────
function sr(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

const HUE_GROUPS = [260, 330, 90, 210, 30, 180, 0, 45, 150, 300, 240, 60];

function cardBg(i: number): string {
  const hue = HUE_GROUPS[i % HUE_GROUPS.length] ?? 0;
  const sat = (20 + sr(i * 3) * 28).toFixed(0);
  const light = (6 + sr(i * 7) * 8).toFixed(0);
  return `hsl(${hue}, ${sat}%, ${light}%)`;
}

function cardBorder(i: number): string {
  const v = sr(i * 11);
  if (v < 0.12) return 'rgba(156,255,63,0.20)';
  if (v < 0.22) return 'rgba(255,184,223,0.17)';
  if (v < 0.30) return 'rgba(124,106,255,0.20)';
  return 'rgba(255,255,255,0.06)';
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function CardWallSection() {
  const set1Ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [cols, setCols] = useState(6);
  const [isDragging, setIsDragging] = useState(false);

  const dragRef = useRef({
    active: false,
    pointerId: null as number | null,
    lastY: 0,
    lastTime: 0,
  });
  const motionRef = useRef({ currentY: 0, targetY: 0, velocity: 0 });

  const totalCards = cols * ROWS;

  // ── Responsive cols ────────────────────────────────────────────────────────
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setCols(w < 640 ? 3 : w < 1024 ? 4 : w < 1440 ? 6 : 7);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // ── Animation loop ─────────────────────────────────────────────────────────
  useEffect(() => {
    const animate = () => {
      const track = trackRef.current;
      const set1 = set1Ref.current;
      if (!track || !set1) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const stripH = set1.offsetHeight;
      const motion = motionRef.current;

      // Auto-scroll + release velocity
      if (!dragRef.current.active) {
        motion.targetY -= AUTO_SPEED;
        motion.targetY += motion.velocity;
        motion.velocity *= 0.94;
        if (Math.abs(motion.velocity) < 0.02) motion.velocity = 0;
      }

      // Infinite loop wrap
      if (stripH > 0) {
        while (motion.targetY <= -stripH) {
          motion.targetY += stripH;
          motion.currentY += stripH;
        }
        while (motion.targetY > 0) {
          motion.targetY -= stripH;
          motion.currentY -= stripH;
        }
      }

      // Lerp toward target
      const easing = dragRef.current.active ? 0.26 : 0.08;
      motion.currentY += (motion.targetY - motion.currentY) * easing;

      track.style.transform = `translate3d(0, ${Math.round(motion.currentY)}px, 0)`;

      // ── Per-card 3-D radial falloff ──────────────────────────────────────
      const vw = window.innerWidth / 2;
      const vh = window.innerHeight / 2;

      cardRefs.current.forEach((card) => {
        if (!card) return;
        const r = card.getBoundingClientRect();
        const cx = (r.left + r.width / 2 - vw) / vw;
        const cy = (r.top + r.height / 2 - vh) / vh;
        const dist = Math.sqrt(cx * cx + cy * cy);
        const scale = Math.max(0.76, 1 - dist * 0.15).toFixed(3);
        const bright = Math.max(0.32, 1 - dist * 0.52).toFixed(3);
        card.style.transform = `scale(${scale})`;
        card.style.filter = `brightness(${bright})`;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [cols]);

  // ── Pointer handlers ───────────────────────────────────────────────────────
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    dragRef.current = {
      active: true,
      pointerId: e.pointerId,
      lastY: e.clientY,
      lastTime: performance.now(),
    };
    motionRef.current.velocity = 0;
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    const dy = e.clientY - dragRef.current.lastY;
    const dt = Math.max(16, performance.now() - dragRef.current.lastTime);
    dragRef.current.lastY = e.clientY;
    dragRef.current.lastTime = performance.now();
    motionRef.current.targetY += dy;
    motionRef.current.velocity = (dy / dt) * 16;
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (
      dragRef.current.pointerId === e.pointerId &&
      e.currentTarget.hasPointerCapture(e.pointerId)
    ) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    dragRef.current.active = false;
    dragRef.current.pointerId = null;
    setIsDragging(false);
  };

  const onWheel = (e: ReactWheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    motionRef.current.targetY -= e.deltaY * 0.6;
    motionRef.current.velocity = -e.deltaY * 0.04;
  };

  // ── Card grid style ────────────────────────────────────────────────────────
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gap: `${GAP}px`,
    padding: `${GAP}px`,
  };

  const renderCards = (setIndex: number) =>
    Array.from({ length: totalCards }, (_, i) => {
      const refIndex = setIndex * totalCards + i;
      return (
        <div
          key={i}
          ref={(el) => { cardRefs.current[refIndex] = el; }}
          className="will-change-transform"
          style={{
            aspectRatio: '4 / 5',
            borderRadius: '18px',
            background: cardBg(i),
            border: `1px solid ${cardBorder(i)}`,
          }}
        />
      );
    });

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <section className="relative overflow-hidden bg-black" style={{ height: '88vh' }}>
      {/* Interactive canvas */}
      <div
        className={`relative h-full overflow-hidden touch-none select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
      >
        {/* Scrolling track (2 identical sets for seamless loop) */}
        <div ref={trackRef} className="absolute inset-x-0 top-0 will-change-transform">
          <div ref={set1Ref} style={gridStyle}>
            {renderCards(0)}
          </div>
          <div style={gridStyle}>
            {renderCards(1)}
          </div>
        </div>
      </div>

      {/* Gradient edges: top & bottom fade to black */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" />
    </section>
  );
}
