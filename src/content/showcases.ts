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

export type ShowcaseMediaItem = {
  title: string;
  description: string;
  src: string;
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

export const showcaseMediaBySlug: Record<string, ShowcaseMediaItem[]> = {
  'creative-visuals': [
    {
      title: '折扣活动海报',
      description: '商业促销主题的创意主视觉，强调鲜明色彩和立体物件组合。',
      src: '/assets/showcases/creative-visuals/01.png',
    },
    {
      title: '字体海报实验',
      description: '以黑色底板承载高对比排版与角色元素，探索展示型海报语言。',
      src: '/assets/showcases/creative-visuals/02.png',
    },
    {
      title: '趣味角色系列',
      description: '围绕玩偶角色做系列化视觉延展，形成统一又活泼的作品组。',
      src: '/assets/showcases/creative-visuals/03.png',
    },
    {
      title: '音乐主题包装',
      description: '结合包装、电商和终端展示场景，强化视觉内容与产品氛围。',
      src: '/assets/showcases/creative-visuals/04.png',
    },
    {
      title: 'AIGC 视觉探索',
      description: '通过高饱和配色与几何发散结构，形成实验感较强的视觉表达。',
      src: '/assets/showcases/creative-visuals/05.png',
    },
    {
      title: '年度内容整理',
      description: '将年度项目以编辑化版式重新组合，形成更适合展示的网站封面页。',
      src: '/assets/showcases/creative-visuals/06.png',
    },
    {
      title: '图形组合海报',
      description: '通过拼贴和图标化组织方式，让系列作品具备更强的系统辨识度。',
      src: '/assets/showcases/creative-visuals/07.png',
    },
  ],
};
