import { useState, useRef, type KeyboardEvent, type ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { Send, Paperclip, Sparkles, ImageUp, X } from 'lucide-react';
import type { ChatSubmitPayload } from '../../hooks/useChat';
import type { NanoModelId } from '../../types/chat';
import { NANO_MODELS } from '../../constants/nano';

interface MessageInputProps {
  onSend: (payload: ChatSubmitPayload) => void;
  disabled?: boolean;
}

type NanoMode = 'text-to-image' | 'image-to-image';

export default function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [value, setValue] = useState('');
  const [mode, setMode] = useState<NanoMode>('text-to-image');
  const [model, setModel] = useState<NanoModelId>('gemini-2.5-flash-image');
  const [selectedImage, setSelectedImage] = useState<{ url: string; name: string } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    if (mode === 'image-to-image' && !selectedImage) return;

    onSend({
      content: trimmed,
      operation: mode,
      model,
      sourceImage: selectedImage ?? undefined,
    });

    setValue('');
    if (mode === 'image-to-image') {
      setSelectedImage(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 120) + 'px';
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') return;
      setSelectedImage({
        url: reader.result,
        name: file.name,
      });
    };
    reader.readAsDataURL(file);
  };

  const canSend = value.trim().length > 0 && !disabled && (mode === 'text-to-image' || Boolean(selectedImage));

  return (
    <div className="px-4 py-3">
      <div className="flex items-end gap-2 rounded-2xl bg-black/82 px-3 py-2 transition-colors focus-within:bg-black/92">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex-shrink-0 p-1.5 text-surface-500 hover:text-surface-300 transition-colors rounded-lg hover:bg-surface-700/50 cursor-pointer"
          title={mode === 'image-to-image' ? '上传参考图' : '切到图生图后可上传参考图'}
        >
          <Paperclip size={18} />
        </button>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder={
            mode === 'image-to-image'
              ? '描述你想如何改这张图，例如：保留构图，换成紫色未来感风格'
              : '输入提示词直接生成图片，例如：一个适合小红书封面的数字人海报'
          }
          rows={1}
          disabled={disabled}
          className="flex-1 bg-transparent resize-none outline-none text-[15px] text-surface-100 placeholder:text-surface-500 max-h-[120px] py-1 leading-snug"
        />

        <motion.button
          onClick={handleSend}
          disabled={!canSend}
          className={`flex-shrink-0 p-2 rounded-xl transition-all cursor-pointer ${
            canSend
              ? 'bg-[#FFB8DF] text-surface-950 shadow-lg shadow-[#FFB8DF]/25 hover:bg-[#FFCBE8]'
              : 'bg-surface-700/50 text-surface-500'
          }`}
          whileTap={canSend ? { scale: 0.92 } : {}}
        >
          <Send size={16} />
        </motion.button>
      </div>

      {mode === 'image-to-image' && (
        <div className="mb-3 rounded-2xl bg-black/72 p-3">
          {selectedImage ? (
            <div className="flex items-center gap-3">
              <img src={selectedImage.url} alt={selectedImage.name} className="h-16 w-16 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="text-xs uppercase tracking-[0.18em] text-[#FFB8DF]">参考图</p>
                <p className="text-sm text-surface-200 truncate mt-1">{selectedImage.name}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedImage(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="p-2 rounded-xl text-surface-400 hover:bg-surface-700/50 hover:text-surface-100 transition-colors"
                title="移除参考图"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-black/78 px-4 py-4 text-sm text-surface-300 transition-colors hover:text-[#FFB8DF]"
            >
              <Paperclip size={16} />
              上传参考图后再描述你想怎么修改
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}

      <div className="mt-2 mb-2 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <ModeButton
            active={mode === 'text-to-image'}
            icon={Sparkles}
            label="Nano 文生图"
            onClick={() => setMode('text-to-image')}
          />
          <ModeButton
            active={mode === 'image-to-image'}
            icon={ImageUp}
            label="Nano 图生图"
            onClick={() => setMode('image-to-image')}
          />
        </div>
        <select
          value={model}
          onChange={(e) => setModel(e.target.value as NanoModelId)}
          className="min-w-[210px] rounded-xl bg-black/82 px-3 py-2 text-sm text-surface-100 outline-none"
        >
          {NANO_MODELS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <p className="mt-1 text-center text-[11px] text-surface-600">
        LQB · Nano 文生图 / 图生图均在当前对话内完成
      </p>
    </div>
  );
}

function ModeButton({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: typeof Sparkles;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-colors ${
        active
          ? 'bg-[#FFB8DF]/12 text-[#FFB8DF]'
          : 'bg-black/62 text-surface-400 hover:bg-black/78 hover:text-surface-200'
      }`}
    >
      <Icon size={14} />
      {label}
    </button>
  );
}
