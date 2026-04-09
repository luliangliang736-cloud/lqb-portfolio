import { useEffect, useCallback } from 'react';
import { useEditorState } from '../../hooks/useEditorState';
import EditorTopBar from './EditorTopBar';
import Toolbar from './Toolbar';
import Canvas from './Canvas';
import PropertiesPanel from './PropertiesPanel';

interface EditorPageProps {
  onBack: () => void;
}

export default function EditorPage({ onBack }: EditorPageProps) {
  const {
    elements, selectedIds, selectedElements, activeTool, canvas,
    selectElement, clearSelection, updateElement, moveElement, resizeElement,
    addElement, deleteSelected, duplicateSelected,
    setActiveTool, setZoom, panCanvas,
  } = useEditorState();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return;

    switch (e.key) {
      case 'v': case 'V': setActiveTool('select'); break;
      case 'h': case 'H': setActiveTool('hand'); break;
      case 'r': case 'R': addElement('rectangle'); break;
      case 'o': case 'O': addElement('ellipse'); break;
      case 't': case 'T': addElement('text'); break;
      case 'Delete': case 'Backspace': deleteSelected(); break;
      case 'd': case 'D':
        if (e.ctrlKey || e.metaKey) { e.preventDefault(); duplicateSelected(); }
        break;
      case ' ':
        e.preventDefault();
        setActiveTool('hand');
        break;
      case 'Escape': clearSelection(); break;
    }
  }, [setActiveTool, addElement, deleteSelected, duplicateSelected, clearSelection]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.key === ' ') setActiveTool('select');
  }, [setActiveTool]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return (
    <div className="h-screen flex flex-col bg-surface-950 overflow-hidden">
      <EditorTopBar canvas={canvas} onZoom={setZoom} onBack={onBack} />
      <div className="flex-1 flex overflow-hidden">
        <Toolbar activeTool={activeTool} onToolChange={setActiveTool} onAddElement={addElement} />
        <Canvas
          elements={elements}
          selectedIds={selectedIds}
          activeTool={activeTool}
          canvas={canvas}
          onSelect={selectElement}
          onClearSelection={clearSelection}
          onMove={moveElement}
          onResize={resizeElement}
          onUpdate={updateElement}
          onPan={panCanvas}
          onZoom={setZoom}
        />
        <PropertiesPanel
          elements={elements}
          selectedElements={selectedElements}
          selectedIds={selectedIds}
          onUpdate={updateElement}
          onSelect={selectElement}
          onDelete={deleteSelected}
          onDuplicate={duplicateSelected}
        />
      </div>
    </div>
  );
}
