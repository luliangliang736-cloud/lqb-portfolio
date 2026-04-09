import { motion } from 'framer-motion';
import CharacterAvatar from '../Avatar/CharacterAvatar';

export default function TypingIndicator() {
  const dotVariants = {
    initial: { y: 0 },
    animate: { y: [0, -6, 0] },
  };

  return (
    <motion.div
      className="flex items-end gap-2.5 px-5"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <CharacterAvatar size="sm" status="thinking" />
      <div className="bg-surface-800/80 backdrop-blur-sm rounded-2xl rounded-bl-md px-4 py-3 border border-surface-700/50">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-2 h-2 rounded-full bg-primary-400"
              variants={dotVariants}
              initial="initial"
              animate="animate"
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
