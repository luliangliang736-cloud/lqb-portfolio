import type { LucideIcon } from 'lucide-react';
import { Clapperboard, ImageIcon, LayoutTemplate, Sparkles } from 'lucide-react';

export type ShowcaseAccent = 'primary' | 'violet' | 'emerald' | 'amber';

export type ShowcaseItem = {
  id: string;
  slug: string;
  icon: LucideIcon;
  tag: string;
  title: string;
  description: string;
  cta: string;
  accent: ShowcaseAccent;
};

export const showcases: ShowcaseItem[] = [
  {
    id: 'creative-visuals',
    slug: 'creative-visuals',
    icon: ImageIcon,
    tag: 'Creative Visuals',
    title: '创意视觉',
    description: 'AI 时代下技术赋能与视觉表达的融合实践探索',
    cta: '查看作品',
    accent: 'primary',
  },
  {
    id: 'form-design',
    slug: 'form-design',
    icon: LayoutTemplate,
    tag: 'Form Design',
    title: '构成设计',
    description: '极简形态下的点线面与多元视觉的研究',
    cta: '查看作品',
    accent: 'violet',
  },
  {
    id: 'ip-scenario',
    slug: 'ip-scenario',
    icon: Clapperboard,
    tag: 'IP scenario',
    title: 'IP及场景',
    description: '一些IP服化道的设计和场景的探究与融合',
    cta: '查看作品',
    accent: 'emerald',
  },
  {
    id: 'dynamic-vision',
    slug: 'dynamic-vision',
    icon: Sparkles,
    tag: 'Dynamic vision',
    title: '动态视觉',
    description: 'Ai时代下的各类动态视觉的探索',
    cta: '查看作品',
    accent: 'amber',
  },
];

export const accentMap: Record<ShowcaseAccent, { tag: string; border: string; glow: string; ctaBg: string }> = {
  primary: {
    tag: 'text-[#AEFF62] bg-[#AEFF62]/10 border-[#AEFF62]/25',
    border: 'border-[#AEFF62]/18 hover:border-[#AEFF62]/35',
    glow: 'bg-[#AEFF62]/7',
    ctaBg: 'text-[#AEFF62] hover:text-[#C3FF8C]',
  },
  violet: {
    tag: 'text-[#FFB8DF] bg-[#FFB8DF]/10 border-[#FFB8DF]/25',
    border: 'border-[#FFB8DF]/18 hover:border-[#FFB8DF]/35',
    glow: 'bg-[#FFB8DF]/7',
    ctaBg: 'text-[#FFB8DF] hover:text-[#FFD1EA]',
  },
  emerald: {
    tag: 'text-[#66DDFF] bg-[#66DDFF]/10 border-[#66DDFF]/25',
    border: 'border-[#66DDFF]/18 hover:border-[#66DDFF]/35',
    glow: 'bg-[#66DDFF]/7',
    ctaBg: 'text-[#66DDFF] hover:text-[#8BE6FF]',
  },
  amber: {
    tag: 'text-[#FFE878] bg-[#FFE878]/10 border-[#FFE878]/25',
    border: 'border-[#FFE878]/18 hover:border-[#FFE878]/35',
    glow: 'bg-[#FFE878]/7',
    ctaBg: 'text-[#FFE878] hover:text-[#FFEE9D]',
  },
};
