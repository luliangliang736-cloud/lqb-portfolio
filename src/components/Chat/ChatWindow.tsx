import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useChat } from '../../hooks/useChat';
import CharacterAvatar from '../Avatar/CharacterAvatar';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import MessageInput from './MessageInput';
import QuickActions from './QuickActions';

export default function ChatWindow() {
  const { messages, isTyping, agentStatus, sendMessage } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showQuickActions, setShowQuickActions] = useState(true);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = (content: string) => {
    setShowQuickActions(false);
    sendMessage(content);
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto w-full">
      {/* Header */}
      <motion.header
        className="flex items-center gap-3 px-5 py-4 border-b border-surface-800/80 bg-surface-950/80 backdrop-blur-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <CharacterAvatar size="lg" status={agentStatus} showStatus />
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-semibold text-surface-50 leading-tight">
            Kaya
          </h1>
          <p className="text-xs text-surface-400 mt-0.5">
            设计部 · 0号员工
          </p>
        </div>
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
            <QuickActions onSelect={handleSend} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <MessageInput onSend={handleSend} disabled={isTyping} />
    </div>
  );
}

function StatusPill({ status }: { status: import('../../types/chat').AgentStatus }) {
  const config = {
    online: { label: '在线', color: 'bg-emerald-500/15 text-emerald-400 ring-emerald-500/30' },
    thinking: { label: '思考中', color: 'bg-amber-500/15 text-amber-400 ring-amber-500/30' },
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
