import { useState, useRef, type KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { Send, Paperclip } from 'lucide-react';

interface MessageInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export default function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
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

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div className="px-4 py-3 border-t border-surface-800/80">
      <div className="flex items-end gap-2 bg-surface-800/50 border border-surface-700/50 rounded-2xl px-3 py-2 focus-within:border-primary-500/50 transition-colors">
        <button
          className="flex-shrink-0 p-1.5 text-surface-500 hover:text-surface-300 transition-colors rounded-lg hover:bg-surface-700/50 cursor-pointer"
          title="上传文件"
        >
          <Paperclip size={18} />
        </button>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder="输入设计需求…"
          rows={1}
          disabled={disabled}
          className="flex-1 bg-transparent resize-none outline-none text-[15px] text-surface-100 placeholder:text-surface-500 max-h-[120px] py-1 leading-snug"
        />

        <motion.button
          onClick={handleSend}
          disabled={!canSend}
          className={`flex-shrink-0 p-2 rounded-xl transition-all cursor-pointer ${
            canSend
              ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30 hover:bg-primary-500'
              : 'bg-surface-700/50 text-surface-500'
          }`}
          whileTap={canSend ? { scale: 0.92 } : {}}
        >
          <Send size={16} />
        </motion.button>
      </div>
      <p className="text-[11px] text-surface-600 text-center mt-2">
        Kaya · 设计部0号员工 — AI 生成内容仅供参考
      </p>
    </div>
  );
}
