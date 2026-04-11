import { ArrowLeft, Minus, Plus, ZoomIn } from 'lucide-react';
import type { CanvasState } from '../../types/editor';

interface EditorTopBarProps {
  canvas: CanvasState;
  onZoom: (z: number) => void;
  onBack: () => void;
}

export default function EditorTopBar({ canvas, onZoom, onBack }: EditorTopBarProps) {
  return (
    <div className="h-12 bg-surface-900 border-b border-surface-800/60 flex items-center px-3 gap-3 justify-between">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-surface-400 hover:text-surface-100 transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">返回</span>
        </button>
        <div className="w-px h-5 bg-surface-800" />
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-[10px] font-bold">K</div>
          <span className="text-sm text-surface-200 font-medium">LQB 设计工作台</span>
        </div>
      </div>

      {/* Center - zoom */}
      <div className="flex items-center gap-1 bg-surface-800/50 rounded-lg px-1">
        <button onClick={() => onZoom(canvas.zoom - 0.1)} className="p-1.5 text-surface-400 hover:text-surface-200 cursor-pointer"><Minus size={14} /></button>
        <span className="text-xs text-surface-300 w-12 text-center">{Math.round(canvas.zoom * 100)}%</span>
        <button onClick={() => onZoom(canvas.zoom + 0.1)} className="p-1.5 text-surface-400 hover:text-surface-200 cursor-pointer"><Plus size={14} /></button>
        <button onClick={() => onZoom(1)} className="p-1.5 text-surface-400 hover:text-surface-200 cursor-pointer" title="重置"><ZoomIn size={14} /></button>
      </div>

      {/* Right */}
      <div className="text-xs text-surface-500">
        按住 Space 拖拽画布 · 滚轮缩放
      </div>
    </div>
  );
}
