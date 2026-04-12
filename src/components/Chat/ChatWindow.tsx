import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useChat, type ChatSubmitPayload } from '../../hooks/useChat';
import type { NanoHistoryItem } from '../../types/chat';
import { Clock3, Maximize2, Minimize2 } from 'lucide-react';
import CharacterAvatar from '../Avatar/CharacterAvatar';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import MessageInput from './MessageInput';
import QuickActions from './QuickActions';
import HistoryPanel from './HistoryPanel';

export default function ChatWindow() {
  const { messages, isTyping, agentStatus, sendMessage } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyItems, setHistoryItems] = useState<NanoHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (!isFullscreen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isFullscreen]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isFullscreen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isFullscreen]);

  const handleSend = (payload: ChatSubmitPayload) => {
    setShowQuickActions(false);
    sendMessage(payload);
  };

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const response = await fetch('/api/nano-history');
      if (!response.ok) {
        throw new Error('Failed to load history');
      }
      const data = await response.json() as { items?: NanoHistoryItem[] };
      setHistoryItems(data.items ?? []);
    } catch {
      setHistoryItems([]);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  const handleOpenHistory = () => {
    setHistoryOpen(true);
    loadHistory();
  };

  const chatContent = (
    <motion.div
      layout
      className={
        isFullscreen
          ? 'fixed inset-0 z-[60] flex h-screen w-screen flex-col bg-surface-950'
          : 'relative flex h-full w-full flex-col'
      }
    >
      {/* Header */}
      <motion.header
        className="flex flex-wrap items-center gap-3 bg-surface-850/78 px-5 py-4 backdrop-blur-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <CharacterAvatar size="lg" status={agentStatus} showStatus />
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-semibold text-surface-50 leading-tight">
            LQB
          </h1>
          <p className="text-xs text-surface-400 mt-0.5">
            设计部 · 0号员工
          </p>
        </div>
        <button
          onClick={handleOpenHistory}
          className="inline-flex items-center gap-1.5 rounded-full bg-surface-800/72 px-3 py-1.5 text-xs text-surface-300 transition-colors hover:bg-surface-700/90 hover:text-[#FFB8DF]"
          title="查看生图历史"
        >
          <Clock3 size={13} />
          生图历史
        </button>
        <button
          onClick={() => setIsFullscreen((prev) => !prev)}
          className="inline-flex items-center gap-1.5 rounded-full bg-surface-800/72 px-3 py-1.5 text-xs text-surface-300 transition-colors hover:bg-surface-700/90 hover:text-[#FFB8DF]"
          title={isFullscreen ? '退出全屏' : '全屏打开'}
        >
          {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          {isFullscreen ? '退出全屏' : '全屏'}
        </button>
        <StatusPill status={agentStatus} />
      </motion.header>

      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto py-5 space-y-4"
      >
        <AnimatePresence mode="popLayout">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {isTyping && <TypingIndicator key="typing" />}
        </AnimatePresence>
      </div>

      {/* Quick Actions */}
      <AnimatePresence>
        {showQuickActions && messages.length <= 1 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <QuickActions onSelect={(text) => handleSend({ content: text, operation: 'text-to-image' })} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <MessageInput onSend={handleSend} disabled={isTyping} />

      <HistoryPanel
        open={historyOpen}
        items={historyItems}
        loading={historyLoading}
        onClose={() => setHistoryOpen(false)}
      />
    </motion.div>
  );

  if (isFullscreen && isMounted) {
    return createPortal(chatContent, document.body);
  }

  return chatContent;
}

function StatusPill({ status }: { status: import('../../types/chat').AgentStatus }) {
  const config = {
    online: { label: '在线', color: 'bg-[#AEFF62]/15 text-[#AEFF62] ring-[#AEFF62]/35' },
    thinking: { label: '思考中', color: 'bg-[#FFB8DF]/15 text-[#FFB8DF] ring-[#FFB8DF]/35' },
    idle: { label: '离线', color: 'bg-surface-500/15 text-surface-400 ring-surface-500/30' },
  };

  const { label, color } = config[status];

  return (
    <motion.span
      key={status}
      className={`text-xs px-2.5 py-1 rounded-full ring-1 ${color}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {label}
    </motion.span>
  );
}
