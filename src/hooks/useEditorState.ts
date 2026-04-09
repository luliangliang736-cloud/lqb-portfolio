import { useState, useCallback } from 'react';
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
    text: 'AI 虚拟设计员工 Kaya', fontSize: 14, fontWeight: 400,
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
    locked: false, visible: true, name: 'Kaya 角色',
  },
];

export function useEditorState() {
  const [elements, setElements] = useState<DesignElement[]>(DEFAULT_ELEMENTS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTool, setActiveTool] = useState<ToolType>('select');
  const [canvas, setCanvas] = useState<CanvasState>({ zoom: 1, offset: { x: 0, y: 0 } });

  const selectElement = useCallback((id: string, multi = false) => {
    setSelectedIds((prev) => {
      if (multi) {
        return prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id];
      }
      return [id];
    });
  }, []);

  const clearSelection = useCallback(() => setSelectedIds([]), []);

  const updateElement = useCallback((id: string, patch: Partial<DesignElement>) => {
    setElements((prev) => prev.map((el) => (el.id === id ? { ...el, ...patch } : el)));
  }, []);

  const moveElement = useCallback((id: string, delta: Position) => {
    setElements((prev) =>
      prev.map((el) =>
        el.id === id && !el.locked
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

  const addElement = useCallback((type: DesignElement['type']) => {
    const base: DesignElement = {
      id: genId(), type, position: { x: 200, y: 200 },
      size: type === 'text' ? { width: 200, height: 40 } : { width: 150, height: 150 },
      rotation: 0, fill: type === 'text' ? '#ffffff' : '#7c6aff',
      stroke: 'transparent', strokeWidth: 0, opacity: 1,
      borderRadius: type === 'ellipse' ? 9999 : 8,
      locked: false, visible: true,
      name: `${type === 'rectangle' ? '矩形' : type === 'ellipse' ? '椭圆' : type === 'text' ? '文字' : '图片'} ${elements.length + 1}`,
    };
    if (type === 'text') {
      base.text = '双击编辑';
      base.fontSize = 18;
      base.fontWeight = 400;
    }
    setElements((prev) => [...prev, base]);
    setSelectedIds([base.id]);
    setActiveTool('select');
  }, [elements.length]);

  const deleteSelected = useCallback(() => {
    setElements((prev) => prev.filter((el) => !selectedIds.includes(el.id)));
    setSelectedIds([]);
  }, [selectedIds]);

  const duplicateSelected = useCallback(() => {
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
  }, [selectedIds]);

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
    selectElement, clearSelection, updateElement, moveElement, resizeElement,
    addElement, deleteSelected, duplicateSelected,
    setActiveTool, setZoom, panCanvas,
  };
}
