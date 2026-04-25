import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

type PreviewImage = {
  src: string;
  width: number;
  height: number;
  title?: string;
} | null;

type ImagePreviewOverlayProps = {
  image: PreviewImage;
  scale: number;
  maxScale?: number;
  canZoomIn: boolean;
  canZoomOut: boolean;
  onScaleChange: (updater: number | ((value: number) => number)) => void;
  onClose: () => void;
};

type DragState = {
  pointerId: number;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
};

const MIN_PREVIEW_SCALE = 0.25;

function clampScale(value: number, maxScale: number) {
  return Math.min(maxScale, Math.max(MIN_PREVIEW_SCALE, Number(value.toFixed(2))));
}

export default function ImagePreviewOverlay({
  image,
  scale,
  maxScale = 3,
  canZoomIn,
  canZoomOut,
  onScaleChange,
  onClose,
}: ImagePreviewOverlayProps) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStateRef = useRef<DragState | null>(null);
  const initialScaleRef = useRef(scale);

  useEffect(() => {
    if (!image) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [image]);

  useEffect(() => {
    if (!image) {
      return;
    }

    initialScaleRef.current = scale;
    setOffset({ x: 0, y: 0 });
    setIsDragging(false);
    dragStateRef.current = null;
  }, [image, scale]);

  if (!image) {
    return null;
  }

  const stopPropagation = (event: React.SyntheticEvent) => {
    event.stopPropagation();
  };

  const updateScale = (updater: number | ((value: number) => number)) => {
    onScaleChange((currentValue) => {
      const nextValue = typeof updater === 'function'
        ? updater(currentValue)
        : updater;

      return clampScale(nextValue, maxScale);
    });
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: offset.x,
      originY: offset.y,
    };

    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    setOffset({
      x: dragState.originX + (event.clientX - dragState.startX),
      y: dragState.originY + (event.clientY - dragState.startY),
    });
  };

  const finishDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    event.preventDefault();
    event.stopPropagation();
    dragStateRef.current = null;
    setIsDragging(false);
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const delta = event.deltaY < 0 ? 0.12 : -0.12;
    updateScale((value) => value + delta);
  };

  const resetView = () => {
    setOffset({ x: 0, y: 0 });
    updateScale(initialScaleRef.current);
  };

  const handleDoubleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    setOffset({ x: 0, y: 0 });
    updateScale((value) => {
      const isNearInitialScale = Math.abs(value - initialScaleRef.current) < 0.08;
      return isNearInitialScale
        ? Math.min(maxScale, Math.max(initialScaleRef.current * 1.8, 1))
        : initialScaleRef.current;
    });
  };

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/92 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={image.title ? `${image.title} 全屏预览` : '图片全屏预览'}
    >
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onClose();
        }}
        className="absolute top-5 right-5 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/45 text-surface-100 transition-colors hover:border-white/20 hover:bg-black/65"
        aria-label="关闭全屏预览"
      >
        <X size={18} />
      </button>

      <div className="absolute inset-0 overflow-hidden" onWheel={handleWheel}>
        <div className="absolute inset-0">
          <div
            className="absolute left-1/2 top-1/2 touch-none"
            onClick={stopPropagation}
            onDoubleClick={handleDoubleClick}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishDrag}
            onPointerCancel={finishDrag}
            style={{
              width: `${Math.max(image.width * scale, 1)}px`,
              height: `${Math.max(image.height * scale, 1)}px`,
              transform: `translate(-50%, -50%) translate3d(${offset.x}px, ${offset.y}px, 0)`,
              cursor: isDragging ? 'grabbing' : 'grab',
              willChange: 'transform',
            }}
          >
            <img
              src={image.src}
              alt={image.title ? `${image.title} 全屏预览` : '图片全屏预览'}
              className="block h-full w-full max-w-none select-none object-contain shadow-2xl shadow-black/40"
              draggable={false}
            />
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-5 left-1/2 z-20 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/55 p-1.5 text-sm text-surface-100 shadow-lg shadow-black/30"
        onClick={stopPropagation}
      >
        <button
          type="button"
          onClick={() => updateScale((value) => value - 0.25)}
          disabled={!canZoomOut}
          className={`rounded-full px-3 py-2 transition-colors ${
            canZoomOut ? 'hover:bg-white/10' : 'cursor-not-allowed text-surface-500'
          }`}
        >
          缩小
        </button>
        <button
          type="button"
          onClick={resetView}
          className="rounded-full px-3 py-2 transition-colors hover:bg-white/10"
        >
          居中
        </button>
        <span className="min-w-[3.5rem] text-center text-xs text-surface-300">
          {Math.round(scale * 100)}%
        </span>
        <button
          type="button"
          onClick={() => updateScale((value) => value + 0.25)}
          disabled={!canZoomIn}
          className={`rounded-full px-3 py-2 transition-colors ${
            canZoomIn ? 'hover:bg-white/10' : 'cursor-not-allowed text-surface-500'
          }`}
        >
          放大
        </button>
      </div>
    </div>
  );
}
