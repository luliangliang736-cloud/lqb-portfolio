import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from 'react';
import { toAssetPath } from '../../utils/assetPath';

type CanvasOffset = {
  x: number;
  y: number;
};

type CanvasMetrics = {
  columns: number;
  rows: number;
  cellSize: number;
  gap: number;
  width: number;
  height: number;
};

type DragTrailSegment = {
  id: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  createdAt: number;
  width: number;
};

const TILE_COORDINATES = [-1, 0, 1];
const galleryAssetVersion = '20260423-1';
const DRAG_TRAIL_COLOR = '#9CFF3F';
const DRAG_TRAIL_LIFETIME = 220;
const DRAG_TRAIL_MAX_SEGMENTS = 16;
const gallerySources = Array.from(
  { length: 77 },
  (_, index) => toAssetPath(`/assets/more-gallery-placeholders/canvas-${String(index + 1).padStart(2, '0')}.webp?v=${galleryAssetVersion}`),
);

function wrapOffset(value: number, size: number) {
  if (size <= 0) {
    return 0;
  }

  const half = size / 2;
  let next = value;

  while (next <= -half) {
    next += size;
  }

  while (next > half) {
    next -= size;
  }

  return next;
}

function getCanvasMetrics(viewportWidth: number): CanvasMetrics {
  if (viewportWidth >= 1600) {
    const columns = 7;
    const rows = Math.ceil(gallerySources.length / columns);
    const cellSize = 198;
    const gap = 104;

    return {
      columns,
      rows,
      cellSize,
      gap,
      width: columns * cellSize + columns * gap,
      height: rows * cellSize + rows * gap,
    };
  }

  if (viewportWidth >= 1200) {
    const columns = 6;
    const rows = Math.ceil(gallerySources.length / columns);
    const cellSize = 188;
    const gap = 80;

    return {
      columns,
      rows,
      cellSize,
      gap,
      width: columns * cellSize + columns * gap,
      height: rows * cellSize + rows * gap,
    };
  }

  if (viewportWidth >= 768) {
    const columns = 4;
    const rows = Math.ceil(gallerySources.length / columns);
    const cellSize = 176;
    const gap = 56;

    return {
      columns,
      rows,
      cellSize,
      gap,
      width: columns * cellSize + columns * gap,
      height: rows * cellSize + rows * gap,
    };
  }

  const columns = 2;
  const rows = Math.ceil(gallerySources.length / columns);
  const cellSize = 154;
  const gap = 44;

  return {
    columns,
    rows,
    cellSize,
    gap,
    width: columns * cellSize + columns * gap,
    height: rows * cellSize + rows * gap,
  };
}

function getCardPosition(index: number, metrics: CanvasMetrics) {
  const column = index % metrics.columns;
  const row = Math.floor(index / metrics.columns);
  const pitch = metrics.cellSize + metrics.gap;
  const inset = metrics.gap / 2;

  return {
    x: inset + column * pitch,
    y: inset + row * pitch,
  };
}

export default function MoreGalleryPage() {
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTrail, setDragTrail] = useState<DragTrailSegment[]>([]);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const trailCleanupFrameRef = useRef<number | null>(null);
  const currentOffsetRef = useRef<CanvasOffset>({ x: 0, y: 0 });
  const targetOffsetRef = useRef<CanvasOffset>({ x: 0, y: 0 });
  const velocityRef = useRef<CanvasOffset>({ x: 0, y: 0 });
  const lastTrailPointRef = useRef<{ x: number; y: number } | null>(null);
  const dragStateRef = useRef({
    active: false,
    pointerId: null as number | null,
    lastX: 0,
    lastY: 0,
    lastTime: 0,
  });
  const metrics = useMemo(() => getCanvasMetrics(viewportWidth), [viewportWidth]);
  const galleryItems = useMemo(
    () => gallerySources.map((src, index) => ({
      title: `占位框 ${index + 1}`,
      src,
    })),
    [],
  );

  const applyTransform = useCallback((offset: CanvasOffset) => {
    if (!canvasRef.current) {
      return;
    }

    canvasRef.current.style.transform = `translate3d(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px), 0)`;
  }, []);

  const normalizeOffset = useCallback((offset: CanvasOffset) => ({
    x: wrapOffset(offset.x, metrics.width),
    y: wrapOffset(offset.y, metrics.height),
  }), [metrics.height, metrics.width]);

  const startAnimation = useCallback(() => {
    if (animationFrameRef.current !== null) {
      return;
    }

    const tick = () => {
      if (!dragStateRef.current.active) {
        if (Math.abs(velocityRef.current.x) > 0.008 || Math.abs(velocityRef.current.y) > 0.008) {
          const rawTarget = {
            x: targetOffsetRef.current.x + velocityRef.current.x,
            y: targetOffsetRef.current.y + velocityRef.current.y,
          };
          const normalizedTarget = normalizeOffset(rawTarget);

          if (rawTarget.x !== normalizedTarget.x) {
            currentOffsetRef.current = {
              ...currentOffsetRef.current,
              x: currentOffsetRef.current.x + (rawTarget.x > 0 ? -metrics.width : metrics.width),
            };
          }

          if (rawTarget.y !== normalizedTarget.y) {
            currentOffsetRef.current = {
              ...currentOffsetRef.current,
              y: currentOffsetRef.current.y + (rawTarget.y > 0 ? -metrics.height : metrics.height),
            };
          }

          targetOffsetRef.current = normalizedTarget;
          velocityRef.current = {
            x: velocityRef.current.x * 0.982,
            y: velocityRef.current.y * 0.982,
          };
        } else {
          velocityRef.current = { x: 0, y: 0 };
        }
      }

      const current = currentOffsetRef.current;
      const target = targetOffsetRef.current;
      const easing = dragStateRef.current.active ? 0.16 : 0.06;
      const next = {
        x: current.x + (target.x - current.x) * easing,
        y: current.y + (target.y - current.y) * easing,
      };

      currentOffsetRef.current = next;
      applyTransform(next);

      const settled =
        Math.abs(target.x - next.x) < 0.2 &&
        Math.abs(target.y - next.y) < 0.2 &&
        Math.abs(velocityRef.current.x) < 0.008 &&
        Math.abs(velocityRef.current.y) < 0.008 &&
        !dragStateRef.current.active;

      if (settled) {
        animationFrameRef.current = null;
        return;
      }

      animationFrameRef.current = window.requestAnimationFrame(tick);
    };

    animationFrameRef.current = window.requestAnimationFrame(tick);
  }, [applyTransform, metrics.height, metrics.width, normalizeOffset]);

  const shiftCanvas = useCallback((dx: number, dy: number) => {
    const rawTarget = {
      x: targetOffsetRef.current.x + dx,
      y: targetOffsetRef.current.y + dy,
    };
    const normalizedTarget = normalizeOffset(rawTarget);

    if (rawTarget.x !== normalizedTarget.x) {
      currentOffsetRef.current = {
        ...currentOffsetRef.current,
        x: currentOffsetRef.current.x + (rawTarget.x > 0 ? -metrics.width : metrics.width),
      };
    }

    if (rawTarget.y !== normalizedTarget.y) {
      currentOffsetRef.current = {
        ...currentOffsetRef.current,
        y: currentOffsetRef.current.y + (rawTarget.y > 0 ? -metrics.height : metrics.height),
      };
    }

    targetOffsetRef.current = normalizedTarget;
    startAnimation();
  }, [metrics.height, metrics.width, normalizeOffset, startAnimation]);

  const ensureTrailCleanup = useCallback(() => {
    if (trailCleanupFrameRef.current !== null) {
      return;
    }

    const tick = () => {
      const now = performance.now();

      setDragTrail((current) => {
        const next = current.filter((segment) => now - segment.createdAt < DRAG_TRAIL_LIFETIME);

        if (!next.length) {
          trailCleanupFrameRef.current = null;
        } else {
          trailCleanupFrameRef.current = window.requestAnimationFrame(tick);
        }

        return next;
      });
    };

    trailCleanupFrameRef.current = window.requestAnimationFrame(tick);
  }, []);

  const appendTrailSegment = useCallback((x1: number, y1: number, x2: number, y2: number) => {
    const distance = Math.hypot(x2 - x1, y2 - y1);

    if (distance < 4) {
      return;
    }

    const now = performance.now();

    setDragTrail((current) => [
      ...current.filter((segment) => now - segment.createdAt < DRAG_TRAIL_LIFETIME),
      {
        id: now + Math.random(),
        x1,
        y1,
        x2,
        y2,
        createdAt: now,
        width: Math.min(2.2, Math.max(1, distance * 0.035)),
      },
    ].slice(-DRAG_TRAIL_MAX_SEGMENTS));
    ensureTrailCleanup();
  }, [ensureTrailCleanup]);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const normalized = normalizeOffset(targetOffsetRef.current);
    targetOffsetRef.current = normalized;
    currentOffsetRef.current = normalized;
    applyTransform(normalized);
  }, [applyTransform, normalizeOffset]);

  useEffect(() => () => {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
    }
    if (trailCleanupFrameRef.current !== null) {
      window.cancelAnimationFrame(trailCleanupFrameRef.current);
    }
  }, []);

  const handleWheel = useCallback((event: ReactWheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const diagonalDelta = (event.deltaY + event.deltaX) * 0.2;
    const wheelVelocity = diagonalDelta * 0.42;
    velocityRef.current = {
      x: velocityRef.current.x * 0.42 - wheelVelocity * 0.58,
      y: velocityRef.current.y * 0.42 - wheelVelocity * 0.58,
    };
    shiftCanvas(-diagonalDelta, -diagonalDelta);
    startAnimation();
  }, [shiftCanvas, startAnimation]);

  const handlePointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    dragStateRef.current = {
      active: true,
      pointerId: event.pointerId,
      lastX: event.clientX,
      lastY: event.clientY,
      lastTime: performance.now(),
    };
    velocityRef.current = { x: 0, y: 0 };
    lastTrailPointRef.current = event.pointerType === 'touch'
      ? null
      : { x: event.clientX, y: event.clientY };
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    startAnimation();
  }, [startAnimation]);

  const handlePointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragStateRef.current.active) {
      return;
    }

    const now = performance.now();
    const dx = (event.clientX - dragStateRef.current.lastX) * 0.52;
    const dy = (event.clientY - dragStateRef.current.lastY) * 0.52;
    const deltaTime = Math.max(now - dragStateRef.current.lastTime, 16);

    dragStateRef.current.lastX = event.clientX;
    dragStateRef.current.lastY = event.clientY;
    dragStateRef.current.lastTime = now;
    const measuredVelocity = {
      x: (dx / deltaTime) * 22,
      y: (dy / deltaTime) * 22,
    };
    velocityRef.current = {
      x: velocityRef.current.x * 0.6 + measuredVelocity.x * 0.4,
      y: velocityRef.current.y * 0.6 + measuredVelocity.y * 0.4,
    };

    if (event.pointerType !== 'touch') {
      const lastTrailPoint = lastTrailPointRef.current;

      if (lastTrailPoint) {
        appendTrailSegment(lastTrailPoint.x, lastTrailPoint.y, event.clientX, event.clientY);
      }

      lastTrailPointRef.current = { x: event.clientX, y: event.clientY };
    }

    shiftCanvas(dx, dy);
  }, [appendTrailSegment, shiftCanvas]);

  const finishDrag = useCallback((event?: ReactPointerEvent<HTMLDivElement>) => {
    if (
      event &&
      dragStateRef.current.pointerId === event.pointerId &&
      event.currentTarget.hasPointerCapture(event.pointerId)
    ) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    dragStateRef.current.active = false;
    dragStateRef.current.pointerId = null;
    lastTrailPointRef.current = null;
    setIsDragging(false);
    startAnimation();
  }, [startAnimation]);

  return (
    <main className="h-screen overflow-hidden bg-black">
      {galleryItems.length ? (
        <div
          className={`relative h-screen overflow-hidden touch-none select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishDrag}
          onPointerCancel={finishDrag}
        >
          <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
            <svg className="h-full w-full">
              {dragTrail.map((segment) => {
                const age = performance.now() - segment.createdAt;
                const progress = Math.max(0, 1 - age / DRAG_TRAIL_LIFETIME);
                const glowOpacity = progress * 0.22;
                const coreOpacity = progress * 0.95;

                return (
                  <g key={segment.id}>
                    <line
                      x1={segment.x1}
                      y1={segment.y1}
                      x2={segment.x2}
                      y2={segment.y2}
                      stroke={DRAG_TRAIL_COLOR}
                      strokeWidth={segment.width * 2.4}
                      strokeLinecap="round"
                      opacity={glowOpacity}
                    />
                    <line
                      x1={segment.x1}
                      y1={segment.y1}
                      x2={segment.x2}
                      y2={segment.y2}
                      stroke={DRAG_TRAIL_COLOR}
                      strokeWidth={segment.width}
                      strokeLinecap="round"
                      opacity={coreOpacity}
                    />
                  </g>
                );
              })}
            </svg>
          </div>
          <div
            ref={canvasRef}
            className="absolute left-1/2 top-1/2 will-change-transform"
            style={{ transform: 'translate3d(-50%, -50%, 0)' }}
          >
            {TILE_COORDINATES.flatMap((tileY) => TILE_COORDINATES.map((tileX) => (
              <div
                key={`tile-${tileX}-${tileY}`}
                className="absolute"
                style={{
                  left: tileX * metrics.width,
                  top: tileY * metrics.height,
                  width: metrics.width,
                  height: metrics.height,
                }}
              >
                <div className="relative" style={{ width: `${metrics.width}px`, height: `${metrics.height}px` }}>
                  {galleryItems.map((item, index) => {
                    const position = getCardPosition(index, metrics);

                    return (
                    <article
                      key={`${tileX}-${tileY}-${item.title}`}
                      className="group absolute"
                      style={{
                        left: `${position.x}px`,
                        top: `${position.y}px`,
                        width: `${metrics.cellSize}px`,
                        height: `${metrics.cellSize}px`,
                      }}
                    >
                      <div
                        className="flex items-center justify-center"
                        style={{
                          width: `${metrics.cellSize}px`,
                          height: `${metrics.cellSize}px`,
                        }}
                      >
                        <img
                          src={item.src}
                          alt={item.title}
                          className="block max-h-full max-w-full object-contain transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:scale-[1.14] group-hover:rotate-[-4deg]"
                          loading="lazy"
                          decoding="async"
                          draggable={false}
                        />
                      </div>
                    </article>
                    );
                  })}
                </div>
              </div>
            )))}
          </div>
        </div>
      ) : (
        <div className="flex min-h-[calc(100vh-7rem)] items-center justify-center text-sm text-surface-500">
          暂无作品内容
        </div>
      )}
    </main>
  );
}
