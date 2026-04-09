import { motion } from 'framer-motion';
import type { Message } from '../../types/chat';
import CharacterAvatar from '../Avatar/CharacterAvatar';

interface MessageBubbleProps {
  message: Message;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isAssistant = message.role === 'assistant';

  return (
    <motion.div
      className={`flex items-end gap-2.5 px-5 ${isAssistant ? '' : 'flex-row-reverse'}`}
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {isAssistant && <CharacterAvatar size="sm" />}

      <div className={`max-w-[75%] flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}>
        <div
          className={`rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed whitespace-pre-wrap break-words ${
            isAssistant
              ? 'bg-surface-800/80 backdrop-blur-sm text-surface-100 rounded-bl-md border border-surface-700/50'
              : 'bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-br-md shadow-lg shadow-primary-500/20'
          }`}
        >
          {message.content}
        </div>
        <span className="text-[11px] text-surface-500 mt-1 px-1">
          {formatTime(message.timestamp)}
        </span>
      </div>

      {!isAssistant && (
        <div className="w-8 h-8 rounded-full bg-surface-700 flex items-center justify-center text-sm text-surface-300 flex-shrink-0">
          U
        </div>
      )}
    </motion.div>
  );
}
