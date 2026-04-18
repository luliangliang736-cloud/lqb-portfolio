import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock3, Download, Image as ImageIcon, Sparkles, X, Copy, ZoomIn, ZoomOut, RotateCcw, Move } from 'lucide-react';
import type { NanoHistoryItem } from '../../types/chat';
import { getNanoModelLabel, getNanoOperationLabel } from '../../constants/nano';

interface HistoryPanelProps {
  open: boolean;
  items: NanoHistoryItem[];
  loading: boolean;
  onClose: () => void;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/* ─────────── Fullscreen Image Viewer ─────────── */

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 5;
const ZOOM_STEP = 0.25;

interface ViewerProps {
  item: NanoHistoryItem;
  onClose: () => void;
}

function FullscreenViewer({ item, onClose }: ViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const offsetStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const resetView = useCallback(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  const handleZoom = useCallback((delta: number) => {
    setZoom((prev) => {
      const next = prev + delta;
      return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Number(next.toFixed(2))));
    });
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    handleZoom(e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP);
  }, [handleZoom]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return;
    dragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    offsetStart.current = { ...offset };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [offset]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    setOffset({
      x: offsetStart.current.x + (e.clientX - dragStart.current.x),
      y: offsetStart.current.y + (e.clientY - dragStart.current.y),
    });
  }, []);

  const handlePointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === containerRef.current) onClose();
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex flex-col bg-black/90 backdrop-blur-sm">
      {/* Top bar */}
      <div className="flex shrink-0 items-center justify-between border-b border-white/10 bg-black/60 px-5 py-3">
        <div className="flex items-center gap-3 text-[11px]">
          <span className="inline-flex items-center gap-1 rounded-full border border-primary-500/30 bg-primary-500/10 px-2.5 py-1 font-medium text-primary-200">
            <Sparkles size={12} />
            {getNanoOperationLabel(item.operation)}
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-medium text-surface-300">
            {getNanoModelLabel(item.model)}
          </span>
          {item.hasSourceImage && (
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-medium text-surface-300">
              含参考图
            </span>
          )}
          <span className="text-surface-500">{item.width} x {item.height}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigator.clipboard.writeText(item.prompt)}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[12px] font-medium text-surface-200 transition-colors hover:bg-white/10"
          >
            <Copy size={12} />
            复制提示词
          </button>
          <a
            href={item.imageUrl}
            download
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[12px] font-medium text-surface-200 transition-colors hover:bg-white/10"
          >
            <Download size={12} />
            下载
          </a>
          <button
            onClick={onClose}
            className="ml-2 rounded-full border border-white/10 bg-white/5 p-2 text-surface-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Image area */}
      <div
        ref={containerRef}
        className="relative flex-1 overflow-hidden"
        style={{ cursor: zoom > 1 ? (dragging.current ? 'grabbing' : 'grab') : 'default' }}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={handleBackdropClick}
      >
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 select-none"
          style={{
            transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
            transition: dragging.current ? 'none' : 'transform 0.15s ease-out',
          }}
        >
          <img
            src={item.imageUrl}
            alt={item.prompt}
            className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
            draggable={false}
          />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex shrink-0 items-center justify-between border-t border-white/10 bg-black/60 px-5 py-3">
        <p className="max-w-[50%] truncate text-sm leading-6 text-surface-300" title={item.prompt}>
          {item.prompt}
        </p>

        <div className="flex items-center gap-2">
          {zoom > 1 && (
            <span className="mr-1 flex items-center gap-1 text-[11px] text-surface-500">
              <Move size={12} />
              拖拽平移
            </span>
          )}
          <button
            onClick={() => handleZoom(-ZOOM_STEP)}
            disabled={zoom <= ZOOM_MIN}
            className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[12px] font-medium text-surface-200 transition-colors hover:bg-white/10 disabled:pointer-events-none disabled:opacity-30"
          >
            <ZoomOut size={12} />
            缩小
          </button>
          <span className="min-w-[48px] text-center text-[11px] text-surface-300">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => handleZoom(ZOOM_STEP)}
            disabled={zoom >= ZOOM_MAX}
            className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[12px] font-medium text-surface-200 transition-colors hover:bg-white/10 disabled:pointer-events-none disabled:opacity-30"
          >
            <ZoomIn size={12} />
            放大
          </button>
          <button
            onClick={resetView}
            className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[12px] font-medium text-surface-200 transition-colors hover:bg-white/10"
          >
            <RotateCcw size={12} />
            重置
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/* ─────────── History Side Panel ─────────── */

export default function HistoryPanel({ open, items, loading, onClose }: HistoryPanelProps) {
  const [activeItem, setActiveItem] = useState<NanoHistoryItem | null>(null);

  useEffect(() => {
    if (!open) setActiveItem(null);
  }, [open]);

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="absolute inset-0 z-20 bg-surface-950/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            <motion.aside
              className="absolute inset-y-0 left-0 z-30 w-full max-w-sm border-r border-surface-800/80 bg-surface-950/96 backdrop-blur-xl shadow-2xl"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 280, damping: 30 }}
            >
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-surface-800/80 px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Clock3 size={16} className="text-primary-300" />
                    <div>
                      <p className="text-sm font-semibold text-surface-100">生图历史</p>
                      <p className="text-[11px] text-surface-500">点击图片可全屏查看，支持缩放与拖拽</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="rounded-xl p-2 text-surface-400 transition-colors hover:bg-surface-800 hover:text-surface-100"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  {loading ? (
                    <div className="rounded-2xl border border-surface-800/70 bg-surface-900/60 p-4 text-sm leading-6 text-surface-400">
                      正在加载历史记录...
                    </div>
                  ) : items.length ? (
                    <div className="rounded-2xl border border-surface-800/70 bg-surface-900/60 p-3">
                      <div className="mb-3 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-surface-100">图片图库</p>
                          <p className="text-[11px] text-surface-500">点击图片全屏查看</p>
                        </div>
                        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-medium text-surface-300">
                          共 {items.length} 张
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {items.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => setActiveItem(item)}
                            className="group overflow-hidden rounded-2xl border border-surface-800/70 bg-surface-950 text-left transition-colors hover:border-primary-400/30"
                          >
                            <img
                              src={item.imageUrl}
                              alt={item.prompt}
                              className="aspect-square w-full bg-surface-900 object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                            />
                            <div className="space-y-2 p-3">
                              <div className="flex flex-wrap items-center gap-2 text-[10px]">
                                <span className="inline-flex items-center gap-1 rounded-full border border-primary-500/20 bg-primary-500/10 px-2 py-0.5 text-primary-200">
                                  <Sparkles size={12} />
                                  {getNanoOperationLabel(item.operation)}
                                </span>
                                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-surface-300">
                                  {getNanoModelLabel(item.model)}
                                </span>
                              </div>
                              <p className="line-clamp-2 text-sm leading-6 text-surface-100">{item.prompt}</p>
                              <div className="flex items-center justify-between text-[10px] text-surface-500">
                                <span>{item.width} x {item.height}</span>
                                <span>{formatDate(item.createdAt)}</span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-surface-700/60 bg-surface-900/40 p-6 text-center">
                      <ImageIcon size={22} className="mx-auto text-surface-500" />
                      <p className="mt-3 text-sm font-medium text-surface-300">还没有生成历史</p>
                      <p className="mt-1 text-[11px] text-surface-500">生成后的图片会自动记录在这里</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {activeItem && (
        <FullscreenViewer item={activeItem} onClose={() => setActiveItem(null)} />
      )}
    </>
  );
}
