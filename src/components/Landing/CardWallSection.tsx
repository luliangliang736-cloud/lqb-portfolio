import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';

const ROWS = [0, 1, 2] as const;
const TOTAL_COLS = 20;
const CARD_IMAGE_COUNT = 21;
const CARD_ASSET_VERSION = '20260603-1513';
const ANGLE_STEP_DEG = 18;
const ANGLE_STEP = ANGLE_STEP_DEG * Math.PI / 180;
const AUTO_SCROLL_SPEED = 0.0012;
const FULL_OPACITY_ANGLE = ANGLE_STEP * 1.96;
const FADE_OUT_ANGLE = ANGLE_STEP * 2.82;

const BASE = import.meta.env.BASE_URL ?? '/';
const OPERATOR_IMAGE = `${BASE.replace(/\/$/, '')}/assets/操作人物.png?v=20260602-1610`;
const toCardAsset = (colIndex: number, row: number) => {
  const imageIndex = (colIndex * ROWS.length + row) % CARD_IMAGE_COUNT + 1;
  const fileName = `card-${String(imageIndex).padStart(2, '0')}.webp`;

  return `${BASE.replace(/\/$/, '')}/assets/card-wall/${fileName}?v=${CARD_ASSET_VERSION}`;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function wrapAngle(value: number) {
  const full = TOTAL_COLS * ANGLE_STEP;
  let next = value % full;

  if (next < 0) {
    next += full;
  }

  return next;
}

function shortestAngle(value: number) {
  const full = TOTAL_COLS * ANGLE_STEP;
  let next = value;

  while (next > full / 2) next -= full;
  while (next < -full / 2) next += full;

  return next;
}

export default function CardWallSection() {
  const columnRefs = useRef<(HTMLDivElement | null)[]>(Array(TOTAL_COLS).fill(null));
  const frameRef = useRef<number | null>(null);
  const angleRef = useRef(ANGLE_STEP * 2);
  const velocityRef = useRef(0);
  const dragRef = useRef({
    active: false,
    pointerId: null as number | null,
    lastX: 0,
    lastTime: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);

  const cardW = clamp(viewportWidth * 0.187, 152, 242);
  const cardH = clamp(viewportWidth * 0.138, 112, 178) + 50;
  const gapX = clamp(viewportWidth * 0.0075, 7, 12);
  const gapY = clamp(viewportWidth * 0.0078, 7, 12);
  const colStep = cardW + gapX;
  const rowStep = cardH + gapY;
  const totalH = cardH * ROWS.length + gapY * (ROWS.length - 1);
  const maskedSceneH = Math.max(totalH + 520, 1180);
  // Matches the approved static shape: outer visible columns sit at ±1.88 column steps.
  const radius = (1.88 * colStep) / Math.sin(ANGLE_STEP * 2);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const animate = () => {
      if (!dragRef.current.active) {
        angleRef.current = wrapAngle(angleRef.current + AUTO_SCROLL_SPEED + velocityRef.current);
        velocityRef.current *= 0.93;

        if (Math.abs(velocityRef.current) < 0.00008) {
          velocityRef.current = 0;
        }
      }

      columnRefs.current.forEach((column, colIndex) => {
        if (!column) return;

        const angle = shortestAngle(colIndex * ANGLE_STEP - angleRef.current);
        const x = radius * Math.sin(angle);
        const z = radius * (1 - Math.cos(angle));
        const rotateY = -(angle * 180 / Math.PI);
        const absAngle = Math.abs(angle);
        const fadeProgress = clamp(
          (absAngle - FULL_OPACITY_ANGLE) / (FADE_OUT_ANGLE - FULL_OPACITY_ANGLE),
          0,
          1,
        );
        const opacity = 1 - fadeProgress;

        column.style.transform = `translate3d(${x.toFixed(2)}px, 0, ${z.toFixed(2)}px) rotateY(${rotateY.toFixed(2)}deg)`;
        column.style.opacity = `${opacity.toFixed(3)}`;
        column.style.pointerEvents = opacity > 0.02 ? 'auto' : 'none';
        column.style.zIndex = `${Math.round(z)}`;
      });

      frameRef.current = window.requestAnimationFrame(animate);
    };

    frameRef.current = window.requestAnimationFrame(animate);

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [radius]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragRef.current = {
      active: true,
      pointerId: event.pointerId,
      lastX: event.clientX,
      lastTime: performance.now(),
    };
    velocityRef.current = 0;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;

    const now = performance.now();
    const dx = event.clientX - dragRef.current.lastX;
    const deltaTime = Math.max(16, now - dragRef.current.lastTime);

    dragRef.current.lastX = event.clientX;
    dragRef.current.lastTime = now;
    angleRef.current = wrapAngle(angleRef.current - dx / radius);
    velocityRef.current = -(dx / deltaTime) * 16 / radius;
  };

  const finishDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (
      dragRef.current.pointerId === event.pointerId &&
      event.currentTarget.hasPointerCapture(event.pointerId)
    ) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    dragRef.current.active = false;
    dragRef.current.pointerId = null;
    setIsDragging(false);
  };

  return (
    <section
      className={`relative flex items-center justify-center bg-black touch-none select-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      style={{
        height: '90vh',
        minHeight: 620,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
    >
      <div className="absolute inset-0">
        <div
          className="absolute left-0 right-0 top-1/2 flex -translate-y-1/2 items-center justify-center"
          style={{
            height: maskedSceneH,
            perspective: '900px',
            perspectiveOrigin: '50% 50%',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, #000 18%, #000 82%, transparent 100%)',
            maskImage: 'linear-gradient(to right, transparent 0%, #000 18%, #000 82%, transparent 100%)',
          }}
        >
          <div
            className="relative"
            style={{
              width: 5 * cardW + 4 * gapX,
              height: totalH,
              transformStyle: 'preserve-3d',
            }}
          >
            <div
              className="absolute left-1/2 top-1/2"
              style={{ width: 0, height: 0, transformStyle: 'preserve-3d' }}
            >
              {Array.from({ length: TOTAL_COLS }, (_, colIndex) => (
                <div
                  key={colIndex}
                  ref={(element) => {
                    columnRefs.current[colIndex] = element;
                  }}
                  className="absolute will-change-transform"
                  style={{
                    left: -cardW / 2,
                    top: -totalH / 2,
                    width: cardW,
                    height: totalH,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {ROWS.map((row) => (
                    <div
                      key={row}
                      className="absolute left-0 overflow-hidden bg-white"
                      style={{
                        top: row * rowStep,
                        width: cardW,
                        height: cardH,
                        borderRadius: 'clamp(12px, 1.5vw, 19px)',
                        boxShadow: '0 0 0 1px rgba(255,255,255,0.05)',
                        backfaceVisibility: 'hidden',
                      }}
                    >
                      <img
                        src={toCardAsset(colIndex, row)}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                        draggable={false}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
