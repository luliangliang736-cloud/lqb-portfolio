import { motion } from 'framer-motion';
import { Image, Megaphone, Palette, LayoutTemplate, Sparkles } from 'lucide-react';

interface QuickActionsProps {
  onSelect: (text: string) => void;
}

const actions = [
  { label: 'Nano 文生图', icon: Sparkles, prompt: '一个面向年轻潮流用户的紫色未来感 AI 数字人宣传海报' },
  { label: '做海报', icon: Image, prompt: '帮我做一张活动海报' },
  { label: '社媒图', icon: Megaphone, prompt: '帮我做一张社媒宣传图' },
  { label: '品牌物料', icon: Palette, prompt: '帮我做品牌宣传物料' },
  { label: 'Banner', icon: LayoutTemplate, prompt: '帮我设计一个网站 banner' },
];

export default function QuickActions({ onSelect }: QuickActionsProps) {
  return (
    <div className="flex gap-2 px-5 pb-2 flex-wrap">
      {actions.map((action, i) => (
        <motion.button
          key={action.label}
          onClick={() => onSelect(action.prompt)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm
            bg-surface-800/60 border border-surface-700/50 text-surface-300
            hover:bg-surface-700/80 hover:text-[#FFB8DF] hover:border-[#FFB8DF]/40
            transition-colors cursor-pointer"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + i * 0.08, duration: 0.25 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <action.icon size={14} />
          {action.label}
        </motion.button>
      ))}
    </div>
  );
}
