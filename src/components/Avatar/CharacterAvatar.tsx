import { motion } from 'framer-motion';
import type { AgentStatus } from '../../types/chat';

interface CharacterAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  status?: AgentStatus;
  showStatus?: boolean;
}

const sizeMap = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-14 h-14 text-lg',
};

const statusColorMap: Record<AgentStatus, string> = {
  online: 'bg-emerald-400',
  thinking: 'bg-amber-400',
  idle: 'bg-surface-500',
};

const statusLabelMap: Record<AgentStatus, string> = {
  online: '在线',
  thinking: '思考中…',
  idle: '离线',
};

export default function CharacterAvatar({
  size = 'md',
  status = 'online',
  showStatus = false,
}: CharacterAvatarProps) {
  return (
    <div className="relative flex-shrink-0">
      <motion.div
        className={`${sizeMap[size]} rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center font-bold text-white shadow-lg shadow-primary-500/20`}
        animate={status === 'thinking' ? { scale: [1, 1.05, 1] } : {}}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
      >
        K
      </motion.div>

      {showStatus && (
        <div className="absolute -bottom-0.5 -right-0.5">
          <span className="relative flex h-3 w-3">
            {status === 'online' && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            )}
            <span
              className={`relative inline-flex rounded-full h-3 w-3 ${statusColorMap[status]} ring-2 ring-surface-900`}
              title={statusLabelMap[status]}
            />
          </span>
        </div>
      )}
    </div>
  );
}
