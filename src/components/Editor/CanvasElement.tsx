import { useRef, useState, useCallback, useEffect } from 'react';
import type { DesignElement, Position, Size } from '../../types/editor';

interface CanvasElementProps {
  element: DesignElement;
  isSelected: boolean;
  zoom: number;
  onSelect: (id: string, multi: boolean) => void;
  onMove: (id: string, delta: Position) => void;
  onResize: (id: string, size: Size, pos?: Position) => void;
  onUpdate: (id: string, patch: Partial<DesignElement>) => void;
}

type Handle = 'nw' | 'ne' | 'sw' | 'se';

export default function CanvasElement({
  element, isSelected, zoom, onSelect, onMove, onResize, onUpdate,
}: CanvasElementProps) {
  const elRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState<Handle | null>(null);
  const [editing, setEditing] = useState(false);
  const dragStart = useRef<Position>({ x: 0, y: 0 });
  const origPos = useRef<Position>({ x: 0, y: 0 });
  const origSize = useRef<Size>({ width: 0, height: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (element.locked) return;
    e.stopPropagation();
    onSelect(element.id, e.shiftKey);
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    origPos.current = { ...element.position };
  }, [element, onSelect]);

  const handleResizeStart = useCallback((handle: Handle, e: React.MouseEvent) => {
    e.stopPropagation();
    setResizing(handle);
    dragStart.current = { x: e.clientX, y: e.clientY };
    origPos.current = { ...element.position };
    origSize.current = { ...element.size };
  }, [element]);

  useEffect(() => {
    if (!dragging && !resizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = (e.clientX - dragStart.current.x) / zoom;
      const dy = (e.clientY - dragStart.current.y) / zoom;

      if (dragging) {
        onMove(element.id, {
          x: origPos.current.x + dx - element.position.x,
          y: origPos.current.y + dy - element.position.y,
        });
      }

      if (resizing) {
        let newW = origSize.current.width;
        let newH = origSize.current.height;
        let newX = origPos.current.x;
        let newY = origPos.current.y;

        if (resizing.includes('e')) newW = Math.max(20, origSize.current.width + dx);
        if (resizing.includes('w')) {
          newW = Math.max(20, origSize.current.width - dx);
          newX = origPos.current.x + dx;
        }
        if (resizing.includes('s')) newH = Math.max(20, origSize.current.height + dy);
        if (resizing.includes('n')) {
          newH = Math.max(20, origSize.current.height - dy);
          newY = origPos.current.y + dy;
        }
        onResize(element.id, { width: newW, height: newH }, { x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setDragging(false);
      setResizing(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, resizing, element, zoom, onMove, onResize]);

  const handleDoubleClick = useCallback(() => {
    if (element.type === 'text') setEditing(true);
  }, [element.type]);

  const style: React.CSSProperties = {
    position: 'absolute',
    left: element.position.x,
    top: element.position.y,
    width: element.size.width,
    height: element.size.height,
    opacity: element.opacity,
    transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
    cursor: element.locked ? 'default' : dragging ? 'grabbing' : 'move',
    display: element.visible ? undefined : 'none',
  };

  const renderContent = () => {
    switch (element.type) {
      case 'rectangle':
        return (
          <div
            className="w-full h-full"
            style={{
              background: element.fill,
              borderRadius: element.borderRadius,
              border: element.strokeWidth ? `${element.strokeWidth}px solid ${element.stroke}` : undefined,
            }}
          />
        );
      case 'ellipse':
        return (
          <div
            className="w-full h-full rounded-full"
            style={{
              background: element.fill,
              border: element.strokeWidth ? `${element.strokeWidth}px solid ${element.stroke}` : undefined,
            }}
          />
        );
      case 'text':
        return editing ? (
          <textarea
            autoFocus
            value={element.text || ''}
            onChange={(e) => onUpdate(element.id, { text: e.target.value })}
            onBlur={() => setEditing(false)}
            onKeyDown={(e) => { if (e.key === 'Escape') setEditing(false); }}
            className="w-full h-full bg-transparent outline-none resize-none"
            style={{
              color: element.fill,
              fontSize: element.fontSize,
              fontWeight: element.fontWeight,
              lineHeight: 1.4,
            }}
          />
        ) : (
          <div
            className="w-full h-full overflow-hidden whitespace-pre-wrap break-words"
            style={{
              color: element.fill,
              fontSize: element.fontSize,
              fontWeight: element.fontWeight,
              lineHeight: 1.4,
            }}
          >
            {element.text}
          </div>
        );
      case 'image':
        return (
          <img
            src={element.imageSrc}
            alt={element.name}
            className="w-full h-full object-contain"
            draggable={false}
            style={{ borderRadius: element.borderRadius }}
          />
        );
      default:
        return null;
    }
  };

  const handles: Handle[] = ['nw', 'ne', 'sw', 'se'];
  const handlePositions: Record<Handle, string> = {
    nw: '-top-1.5 -left-1.5 cursor-nwse-resize',
    ne: '-top-1.5 -right-1.5 cursor-nesw-resize',
    sw: '-bottom-1.5 -left-1.5 cursor-nesw-resize',
    se: '-bottom-1.5 -right-1.5 cursor-nwse-resize',
  };

  return (
    <div
      ref={elRef}
      style={style}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      {renderContent()}

      {isSelected && (
        <>
          <div className="absolute inset-0 border-2 border-primary-500 rounded-sm pointer-events-none" />
          {handles.map((h) => (
            <div
              key={h}
              className={`absolute w-3 h-3 bg-white border-2 border-primary-500 rounded-sm ${handlePositions[h]}`}
              onMouseDown={(e) => handleResizeStart(h, e)}
            />
          ))}
        </>
      )}
    </div>
  );
}
