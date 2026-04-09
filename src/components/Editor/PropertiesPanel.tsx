import type { DesignElement } from '../../types/editor';
import { Eye, EyeOff, Lock, Unlock, Trash2, Copy } from 'lucide-react';

interface PropertiesPanelProps {
  elements: DesignElement[];
  selectedElements: DesignElement[];
  onUpdate: (id: string, patch: Partial<DesignElement>) => void;
  onSelect: (id: string, multi: boolean) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  selectedIds: string[];
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-surface-500 w-8 flex-shrink-0">{label}</span>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function NumberInput({ value, onChange, min, max, step = 1 }: {
  value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number;
}) {
  return (
    <input
      type="number"
      value={Math.round(value)}
      onChange={(e) => onChange(Number(e.target.value))}
      min={min}
      max={max}
      step={step}
      className="w-full bg-surface-800 border border-surface-700/50 rounded-md px-2 py-1 text-xs text-surface-200 outline-none focus:border-primary-500/50"
    />
  );
}

export default function PropertiesPanel({
  elements, selectedElements, onUpdate, onSelect, onDelete, onDuplicate, selectedIds,
}: PropertiesPanelProps) {
  const sel = selectedElements[0];

  return (
    <div className="w-60 bg-surface-900 border-l border-surface-800/60 flex flex-col overflow-hidden">
      {/* Properties */}
      {sel ? (
        <div className="p-3 space-y-4 overflow-y-auto flex-1">
          <div>
            <h3 className="text-xs font-medium text-surface-300 mb-2">{sel.name}</h3>
            <div className="flex gap-1">
              <button onClick={onDuplicate} className="p-1.5 rounded hover:bg-surface-800 text-surface-400 cursor-pointer" title="复制"><Copy size={14} /></button>
              <button onClick={onDelete} className="p-1.5 rounded hover:bg-red-900/30 text-surface-400 hover:text-red-400 cursor-pointer" title="删除"><Trash2 size={14} /></button>
              <button onClick={() => onUpdate(sel.id, { locked: !sel.locked })} className="p-1.5 rounded hover:bg-surface-800 text-surface-400 cursor-pointer" title="锁定">
                {sel.locked ? <Lock size={14} /> : <Unlock size={14} />}
              </button>
              <button onClick={() => onUpdate(sel.id, { visible: !sel.visible })} className="p-1.5 rounded hover:bg-surface-800 text-surface-400 cursor-pointer" title="可见">
                {sel.visible ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
            </div>
          </div>

          {/* Position & size */}
          <div className="space-y-2">
            <span className="text-[10px] text-surface-500 uppercase tracking-wider">位置与尺寸</span>
            <div className="grid grid-cols-2 gap-2">
              <Field label="X"><NumberInput value={sel.position.x} onChange={(v) => onUpdate(sel.id, { position: { ...sel.position, x: v } })} /></Field>
              <Field label="Y"><NumberInput value={sel.position.y} onChange={(v) => onUpdate(sel.id, { position: { ...sel.position, y: v } })} /></Field>
              <Field label="W"><NumberInput value={sel.size.width} onChange={(v) => onUpdate(sel.id, { size: { ...sel.size, width: Math.max(1, v) } })} min={1} /></Field>
              <Field label="H"><NumberInput value={sel.size.height} onChange={(v) => onUpdate(sel.id, { size: { ...sel.size, height: Math.max(1, v) } })} min={1} /></Field>
            </div>
          </div>

          {/* Fill */}
          <div className="space-y-2">
            <span className="text-[10px] text-surface-500 uppercase tracking-wider">填充</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={sel.fill.startsWith('rgba') || sel.fill === 'transparent' ? '#000000' : sel.fill}
                onChange={(e) => onUpdate(sel.id, { fill: e.target.value })}
                className="w-8 h-8 rounded border border-surface-700 cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={sel.fill}
                onChange={(e) => onUpdate(sel.id, { fill: e.target.value })}
                className="flex-1 bg-surface-800 border border-surface-700/50 rounded-md px-2 py-1 text-xs text-surface-200 outline-none"
              />
            </div>
          </div>

          {/* Opacity */}
          <div className="space-y-2">
            <span className="text-[10px] text-surface-500 uppercase tracking-wider">不透明度</span>
            <input
              type="range"
              min={0} max={1} step={0.01}
              value={sel.opacity}
              onChange={(e) => onUpdate(sel.id, { opacity: Number(e.target.value) })}
              className="w-full accent-primary-500"
            />
          </div>

          {/* Border radius */}
          {(sel.type === 'rectangle' || sel.type === 'image') && (
            <div className="space-y-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider">圆角</span>
              <NumberInput value={sel.borderRadius} onChange={(v) => onUpdate(sel.id, { borderRadius: Math.max(0, v) })} min={0} />
            </div>
          )}

          {/* Text props */}
          {sel.type === 'text' && (
            <div className="space-y-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider">文字</span>
              <NumberInput value={sel.fontSize || 16} onChange={(v) => onUpdate(sel.id, { fontSize: v })} min={8} max={200} />
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-4">
          <span className="text-xs text-surface-500 text-center">点击画布上的元素进行编辑</span>
        </div>
      )}

      {/* Layers */}
      <div className="border-t border-surface-800/60 max-h-[40%] overflow-y-auto">
        <div className="px-3 py-2">
          <span className="text-[10px] text-surface-500 uppercase tracking-wider">图层</span>
        </div>
        <div className="px-1 pb-2">
          {[...elements].reverse().map((el) => (
            <button
              key={el.id}
              onClick={() => onSelect(el.id, false)}
              className={`w-full text-left px-2 py-1.5 rounded text-xs flex items-center gap-2 transition-colors cursor-pointer ${
                selectedIds.includes(el.id)
                  ? 'bg-primary-600/15 text-primary-300'
                  : 'text-surface-400 hover:bg-surface-800'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: el.fill === 'transparent' ? '#3f3f46' : el.fill }} />
              <span className="truncate">{el.name}</span>
              {!el.visible && <EyeOff size={10} className="ml-auto text-surface-600" />}
              {el.locked && <Lock size={10} className="ml-auto text-surface-600" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
