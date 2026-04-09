import { useRef, useCallback, useEffect } from 'react';
import type { DesignElement, ToolType, CanvasState, Position, Size } from '../../types/editor';
import CanvasElement from './CanvasElement';

interface CanvasProps {
  elements: DesignElement[];
  selectedIds: string[];
  activeTool: ToolType;
  canvas: CanvasState;
  onSelect: (id: string, multi: boolean) => void;
  onClearSelection: () => void;
  onMove: (id: string, delta: Position) => void;
  onResize: (id: string, size: Size, pos?: Position) => void;
  onUpdate: (id: string, patch: Partial<DesignElement>) => void;
  onPan: (delta: Position) => void;
  onZoom: (z: number) => void;
}

export default function Canvas({
  elements, selectedIds, activeTool, canvas,
  onSelect, onClearSelection, onMove, onResize, onUpdate, onPan, onZoom,
}: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isPanning = useRef(false);
  const lastMouse = useRef<Position>({ x: 0, y: 0 });

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      const delta = -e.deltaY * 0.002;
      onZoom(canvas.zoom * (1 + delta));
    } else {
      onPan({ x: -e.deltaX, y: -e.deltaY });
    }
  }, [canvas.zoom, onPan, onZoom]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target !== containerRef.current && e.target !== containerRef.current?.firstChild) return;
    onClearSelection();

    if (activeTool === 'hand' || e.button === 1) {
      isPanning.current = true;
      lastMouse.current = { x: e.clientX, y: e.clientY };
    }
  }, [activeTool, onClearSelection]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isPanning.current) return;
      const dx = e.clientX - lastMouse.current.x;
      const dy = e.clientY - lastMouse.current.y;
      lastMouse.current = { x: e.clientX, y: e.clientY };
      onPan({ x: dx, y: dy });
    };
    const handleMouseUp = () => { isPanning.current = false; };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onPan]);

  const gridSize = 20 * canvas.zoom;
  const offsetX = canvas.offset.x % gridSize;
  const offsetY = canvas.offset.y % gridSize;

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-hidden relative"
      style={{
        background: '#1a1a1f',
        backgroundImage: `radial-gradient(circle, #2a2a32 1px, transparent 1px)`,
        backgroundSize: `${gridSize}px ${gridSize}px`,
        backgroundPosition: `${offsetX}px ${offsetY}px`,
        cursor: activeTool === 'hand' ? (isPanning.current ? 'grabbing' : 'grab') : 'default',
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Zoom transform layer */}
      <div
        style={{
          transform: `translate(${canvas.offset.x}px, ${canvas.offset.y}px) scale(${canvas.zoom})`,
          transformOrigin: '0 0',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        {elements.map((el) => (
          <CanvasElement
            key={el.id}
            element={el}
            isSelected={selectedIds.includes(el.id)}
            zoom={canvas.zoom}
            onSelect={onSelect}
            onMove={onMove}
            onResize={onResize}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </div>
  );
}
