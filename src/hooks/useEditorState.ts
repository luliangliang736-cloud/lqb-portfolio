import { useState, useCallback, useRef } from 'react';
import type { DesignElement, ToolType, CanvasState, Position, Size } from '../types/editor';

let idCounter = 0;
function genId() {
  return `el-${Date.now()}-${++idCounter}`;
}

const DEFAULT_ELEMENTS: DesignElement[] = [
  {
    id: genId(), type: 'rectangle', position: { x: 80, y: 80 }, size: { width: 800, height: 500 },
    rotation: 0, fill: '#ffffff', stroke: '#e0e0e0', strokeWidth: 1, opacity: 1, borderRadius: 12,
    locked: false, visible: true, name: '画板',
  },
  {
    id: genId(), type: 'rectangle', position: { x: 120, y: 120 }, size: { width: 320, height: 200 },
    rotation: 0, fill: '#7c6aff', stroke: 'transparent', strokeWidth: 0, opacity: 1, borderRadius: 16,
    locked: false, visible: true, name: 'Banner 背景',
  },
  {
    id: genId(), type: 'text', position: { x: 160, y: 170 }, size: { width: 240, height: 48 },
    rotation: 0, fill: '#ffffff', stroke: 'transparent', strokeWidth: 0, opacity: 1, borderRadius: 0,
    text: '设计部 0号员工', fontSize: 28, fontWeight: 700,
    locked: false, visible: true, name: '标题文字',
  },
  {
    id: genId(), type: 'text', position: { x: 160, y: 228 }, size: { width: 240, height: 32 },
    rotation: 0, fill: 'rgba(255,255,255,0.7)', stroke: 'transparent', strokeWidth: 0, opacity: 1, borderRadius: 0,
    text: 'AI 虚拟设计员工 LQB', fontSize: 14, fontWeight: 400,
    locked: false, visible: true, name: '副标题',
  },
  {
    id: genId(), type: 'ellipse', position: { x: 500, y: 130 }, size: { width: 160, height: 160 },
    rotation: 0, fill: '#5c3dd8', stroke: 'transparent', strokeWidth: 0, opacity: 0.6, borderRadius: 9999,
    locked: false, visible: true, name: '装饰圆',
  },
  {
    id: genId(), type: 'rectangle', position: { x: 120, y: 360 }, size: { width: 150, height: 90 },
    rotation: 0, fill: '#1e1e22', stroke: '#3f3f46', strokeWidth: 1, opacity: 1, borderRadius: 10,
    locked: false, visible: true, name: '卡片 A',
  },
  {
    id: genId(), type: 'rectangle', position: { x: 290, y: 360 }, size: { width: 150, height: 90 },
    rotation: 0, fill: '#1e1e22', stroke: '#3f3f46', strokeWidth: 1, opacity: 1, borderRadius: 10,
    locked: false, visible: true, name: '卡片 B',
  },
  {
    id: genId(), type: 'image', position: { x: 500, y: 340 }, size: { width: 130, height: 130 },
    rotation: 0, fill: 'transparent', stroke: 'transparent', strokeWidth: 0, opacity: 1, borderRadius: 8,
    imageSrc: '/assets/character.png',
    locked: false, visible: true, name: 'LQB 角色',
  },
];

interface HistorySnapshot {
  elements: DesignElement[];
  selectedIds: string[];
  canvas: CanvasState;
}

interface AddElementOptions {
  position?: Position;
  size?: Size;
}

function cloneElement(element: DesignElement): DesignElement {
  return {
    ...element,
    position: { ...element.position },
    size: { ...element.size },
  };
}

function cloneElements(elements: DesignElement[]) {
  return elements.map(cloneElement);
}

function createElement(type: DesignElement['type'], index: number, options: AddElementOptions = {}): DesignElement {
  const base: DesignElement = {
    id: genId(),
    type,
    position: options.position ?? { x: 200, y: 200 },
    size: options.size ?? (type === 'text' ? { width: 220, height: 48 } : { width: 150, height: 150 }),
    rotation: 0,
    fill: type === 'text' ? '#ffffff' : '#7c6aff',
    stroke: 'transparent',
    strokeWidth: 0,
    opacity: 1,
    borderRadius: type === 'ellipse' ? 9999 : 8,
    locked: false,
    visible: true,
    name: `${type === 'rectangle' ? '矩形' : type === 'ellipse' ? '椭圆' : type === 'text' ? '文字' : '图片'} ${index}`,
  };

  if (type === 'text') {
    base.text = '输入文字';
    base.fontSize = 18;
    base.fontWeight = 500;
  }

  if (type === 'image') {
    base.fill = 'transparent';
    base.imageSrc = '/assets/character.png';
  }

  return base;
}

export function useEditorState() {
  const [elements, setElements] = useState<DesignElement[]>(DEFAULT_ELEMENTS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTool, setActiveTool] = useState<ToolType>('select');
  const [canvas, setCanvas] = useState<CanvasState>({ zoom: 1, offset: { x: 0, y: 0 } });
  const [history, setHistory] = useState<HistorySnapshot[]>([]);
  const [future, setFuture] = useState<HistorySnapshot[]>([]);
  const [clipboard, setClipboard] = useState<DesignElement[]>([]);
  const batchedSnapshotRef = useRef<HistorySnapshot | null>(null);
  const pasteCountRef = useRef(0);

  const createSnapshot = useCallback((): HistorySnapshot => ({
    elements: cloneElements(elements),
    selectedIds: [...selectedIds],
    canvas: {
      zoom: canvas.zoom,
      offset: { ...canvas.offset },
    },
  }), [elements, selectedIds, canvas]);

  const restoreSnapshot = useCallback((snapshot: HistorySnapshot) => {
    setElements(cloneElements(snapshot.elements));
    setSelectedIds([...snapshot.selectedIds]);
    setCanvas({
      zoom: snapshot.canvas.zoom,
      offset: { ...snapshot.canvas.offset },
    });
  }, []);

  const pushHistory = useCallback((snapshot: HistorySnapshot) => {
    setHistory((prev) => [...prev, snapshot]);
    setFuture([]);
  }, []);

  const beginHistoryAction = useCallback(() => {
    if (!batchedSnapshotRef.current) {
      batchedSnapshotRef.current = createSnapshot();
    }
  }, [createSnapshot]);

  const endHistoryAction = useCallback(() => {
    if (!batchedSnapshotRef.current) return;
    pushHistory(batchedSnapshotRef.current);
    batchedSnapshotRef.current = null;
  }, [pushHistory]);

  const selectElement = useCallback((id: string, multi = false) => {
    setSelectedIds((prev) => {
      if (multi) {
        return prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id];
      }
      return [id];
    });
  }, []);

  const selectElements = useCallback((ids: string[]) => {
    setSelectedIds(ids);
  }, []);

  const clearSelection = useCallback(() => setSelectedIds([]), []);

  const updateElement = useCallback((id: string, patch: Partial<DesignElement>) => {
    pushHistory(createSnapshot());
    setElements((prev) => prev.map((el) => (el.id === id ? { ...el, ...patch } : el)));
  }, [createSnapshot, pushHistory]);

  const moveElement = useCallback((id: string, delta: Position) => {
    setElements((prev) =>
      prev.map((el) =>
        el.id === id && !el.locked
          ? { ...el, position: { x: el.position.x + delta.x, y: el.position.y + delta.y } }
          : el,
      ),
    );
  }, []);

  const moveSelectedElements = useCallback((ids: string[], delta: Position) => {
    setElements((prev) =>
      prev.map((el) =>
        ids.includes(el.id) && !el.locked
          ? { ...el, position: { x: el.position.x + delta.x, y: el.position.y + delta.y } }
          : el,
      ),
    );
  }, []);

  const resizeElement = useCallback((id: string, newSize: Size, newPos?: Position) => {
    setElements((prev) =>
      prev.map((el) => {
        if (el.id !== id || el.locked) return el;
        const updated = { ...el, size: newSize };
        if (newPos) updated.position = newPos;
        return updated;
      }),
    );
  }, []);

  const addElement = useCallback((type: DesignElement['type'], options?: AddElementOptions) => {
    pushHistory(createSnapshot());
    const base = createElement(type, elements.length + 1, options);
    setElements((prev) => [...prev, base]);
    setSelectedIds([base.id]);
    setActiveTool('select');
  }, [createSnapshot, elements.length, pushHistory]);

  const deleteSelected = useCallback(() => {
    if (!selectedIds.length) return;
    pushHistory(createSnapshot());
    setElements((prev) => prev.filter((el) => !selectedIds.includes(el.id)));
    setSelectedIds([]);
  }, [createSnapshot, pushHistory, selectedIds]);

  const duplicateSelected = useCallback(() => {
    if (!selectedIds.length) return;
    pushHistory(createSnapshot());
    const copies: DesignElement[] = [];
    setElements((prev) => {
      const newEls = [...prev];
      for (const id of selectedIds) {
        const src = prev.find((el) => el.id === id);
        if (!src) continue;
        const copy: DesignElement = {
          ...src,
          id: genId(),
          position: { x: src.position.x + 20, y: src.position.y + 20 },
          name: src.name + ' 副本',
        };
        newEls.push(copy);
        copies.push(copy);
      }
      return newEls;
    });
    setSelectedIds(copies.map((c) => c.id));
  }, [createSnapshot, pushHistory, selectedIds]);

  const copySelected = useCallback(() => {
    if (!selectedIds.length) return;
    const copied = elements
      .filter((el) => selectedIds.includes(el.id))
      .map(cloneElement);
    setClipboard(copied);
    pasteCountRef.current = 0;
  }, [elements, selectedIds]);

  const pasteClipboard = useCallback(() => {
    if (!clipboard.length) return;
    pushHistory(createSnapshot());
    pasteCountRef.current += 1;
    const offset = 24 * pasteCountRef.current;
    const copies = clipboard.map((el) => ({
      ...cloneElement(el),
      id: genId(),
      position: {
        x: el.position.x + offset,
        y: el.position.y + offset,
      },
      name: `${el.name} 副本`,
    }));
    setElements((prev) => [...prev, ...copies]);
    setSelectedIds(copies.map((el) => el.id));
  }, [clipboard, createSnapshot, pushHistory]);

  const undo = useCallback(() => {
    if (!history.length) return;
    const currentSnapshot = createSnapshot();
    const previous = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setFuture((prev) => [currentSnapshot, ...prev]);
    batchedSnapshotRef.current = null;
    restoreSnapshot(previous);
  }, [createSnapshot, history, restoreSnapshot]);

  const redo = useCallback(() => {
    if (!future.length) return;
    const currentSnapshot = createSnapshot();
    const next = future[0];
    setFuture((prev) => prev.slice(1));
    setHistory((prev) => [...prev, currentSnapshot]);
    batchedSnapshotRef.current = null;
    restoreSnapshot(next);
  }, [createSnapshot, future, restoreSnapshot]);

  const setZoom = useCallback((z: number) => {
    setCanvas((prev) => ({ ...prev, zoom: Math.max(0.1, Math.min(5, z)) }));
  }, []);

  const panCanvas = useCallback((delta: Position) => {
    setCanvas((prev) => ({
      ...prev,
      offset: { x: prev.offset.x + delta.x, y: prev.offset.y + delta.y },
    }));
  }, []);

  const selectedElements = elements.filter((el) => selectedIds.includes(el.id));

  return {
    elements, selectedIds, selectedElements, activeTool, canvas,
    canUndo: history.length > 0, canRedo: future.length > 0,
    selectElement, selectElements, clearSelection, updateElement, moveElement, moveSelectedElements, resizeElement,
    addElement, deleteSelected, duplicateSelected, copySelected, pasteClipboard,
    beginHistoryAction, endHistoryAction, undo, redo,
    setActiveTool, setZoom, panCanvas,
  };
}
