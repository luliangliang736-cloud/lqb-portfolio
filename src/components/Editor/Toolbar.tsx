import { MousePointer2, Hand, Square, Circle, Type, ImagePlus } from 'lucide-react';
import type { ToolType } from '../../types/editor';

interface ToolbarProps {
  activeTool: ToolType;
  onToolChange: (tool: ToolType) => void;
  onAddElement: (type: 'rectangle' | 'ellipse' | 'text' | 'image') => void;
}

const tools: { type: ToolType; icon: typeof Square; label: string; shortcut: string }[] = [
  { type: 'select', icon: MousePointer2, label: '选择', shortcut: 'V' },
  { type: 'hand', icon: Hand, label: '移动画布', shortcut: 'H' },
  { type: 'rectangle', icon: Square, label: '矩形', shortcut: 'R' },
  { type: 'ellipse', icon: Circle, label: '椭圆', shortcut: 'O' },
  { type: 'text', icon: Type, label: '文字', shortcut: 'T' },
  { type: 'image', icon: ImagePlus, label: '图片', shortcut: 'I' },
];

export default function Toolbar({ activeTool, onToolChange, onAddElement }: ToolbarProps) {
  const handleClick = (tool: ToolType) => {
    onToolChange(tool);
    if (tool === 'rectangle' || tool === 'ellipse' || tool === 'text' || tool === 'image') {
      onAddElement(tool);
    }
  };

  return (
    <div className="w-14 bg-surface-900 border-r border-surface-800/60 flex flex-col items-center py-3 gap-1">
      {tools.map((tool) => {
        const isActive = activeTool === tool.type;
        return (
          <button
            key={tool.type}
            onClick={() => handleClick(tool.type)}
            title={`${tool.label} (${tool.shortcut})`}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
              isActive
                ? 'bg-primary-600/20 text-primary-400'
                : 'text-surface-400 hover:bg-surface-800 hover:text-surface-200'
            }`}
          >
            <tool.icon size={18} />
          </button>
        );
      })}
    </div>
  );
}
