import { motion } from 'framer-motion';
import type { AgentStatus } from '../../types/chat';
import { toAssetPath } from '../../utils/assetPath';

interface CharacterAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  status?: AgentStatus;
  showStatus?: boolean;
  animated?: boolean;
}

const sizeMap = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-14 h-14 text-lg',
};

const statusColorMap: Record<AgentStatus, string> = {
  online: 'bg-[#AEFF62]',
  thinking: 'bg-[#FFB8DF]',
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
  animated = true,
}: CharacterAvatarProps) {
  const avatarClassName = `${sizeMap[size]} overflow-hidden rounded-full shadow-lg shadow-black/20`;

  return (
    <div className="relative flex-shrink-0">
      {animated ? (
        <motion.div
          className={avatarClassName}
          animate={status === 'thinking' ? { scale: [1, 1.05, 1] } : {}}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        >
          <img
            src={toAssetPath('/assets/chat-avatar.png')}
            alt="LQB avatar"
            className="h-full w-full object-cover"
          />
        </motion.div>
      ) : (
        <div className={avatarClassName}>
          <img
            src={toAssetPath('/assets/chat-avatar.png')}
            alt="LQB avatar"
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {showStatus && (
        <div className="absolute -bottom-0.5 -right-0.5">
          <span className="relative flex h-3 w-3">
            {status === 'online' && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#AEFF62] opacity-75" />
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
