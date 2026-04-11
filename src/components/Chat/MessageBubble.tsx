import { motion } from 'framer-motion';
import type { Message } from '../../types/chat';
import { Download, Sparkles } from 'lucide-react';
import CharacterAvatar from '../Avatar/CharacterAvatar';
import { getNanoModelLabel, getNanoOperationLabel } from '../../constants/nano';

interface MessageBubbleProps {
  message: Message;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isAssistant = message.role === 'assistant';
  const imageAttachment = message.attachments?.find((item) => item.type === 'image');
  const isResultCard = isAssistant && message.kind === 'image-result' && imageAttachment;

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
              : 'bg-gradient-to-r from-[#FFB8DF] to-[#AEFF62] text-surface-950 rounded-br-md shadow-lg shadow-[#FFB8DF]/20'
          }`}
        >
          {isResultCard ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#FFB8DF]">
                <Sparkles size={14} />
                <span>Nano Banana</span>
                {message.meta?.operation && (
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 tracking-normal text-[11px] normal-case text-surface-300">
                    {getNanoOperationLabel(message.meta.operation)}
                  </span>
                )}
                {message.meta?.model && (
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 tracking-normal text-[11px] normal-case text-surface-300">
                    {getNanoModelLabel(message.meta.model)}
                  </span>
                )}
                {message.meta?.mode && (
                  <span className="rounded-full border border-[#FFB8DF]/25 bg-[#FFB8DF]/10 px-2 py-0.5 tracking-normal text-[11px] normal-case text-[#FFB8DF]">
                    {message.meta.mode === 'proxy' ? '真实接口' : '演示模式'}
                  </span>
                )}
              </div>

              <img
                src={imageAttachment.url}
                alt={imageAttachment.prompt || imageAttachment.name}
                className="w-full rounded-2xl border border-white/10 bg-surface-900/60 object-cover"
              />

              {imageAttachment.prompt && (
                <div className="rounded-xl bg-surface-900/70 border border-white/6 px-3 py-2">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-surface-500">Prompt</p>
                  <p className="mt-1 text-sm text-surface-200">{imageAttachment.prompt}</p>
                </div>
              )}

              <div className="flex items-center justify-between gap-3 text-xs text-surface-400">
                <span>
                  {imageAttachment.width} x {imageAttachment.height}
                </span>
                <a
                  href={imageAttachment.url}
                  download={imageAttachment.name}
                  className="inline-flex items-center gap-1 rounded-full border border-surface-600/60 px-3 py-1.5 text-surface-200 transition-colors hover:border-[#FFB8DF]/40 hover:text-[#FFB8DF]"
                >
                  <Download size={12} />
                  下载
                </a>
              </div>

              {message.content && (
                <p className="text-sm text-surface-300">{message.content}</p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {imageAttachment && (
                <div className="space-y-2">
                  {!isAssistant && (
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/70">参考图</p>
                  )}
                  <img
                    src={imageAttachment.url}
                    alt={imageAttachment.name}
                    className="max-h-52 w-full rounded-2xl border border-white/12 object-cover"
                  />
                </div>
              )}
              {message.content && <div>{message.content}</div>}
            </div>
          )}
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
