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
  coverSrc?: string;
};

export type ShowcaseMediaItem = {
  id?: string;
  title: string;
  description: string;
  src: string;
  detailMedia?: string[];
};

export function isVideoSrc(src: string) {
  return /\.(mp4|webm|mov|m4v)$/i.test(src);
}

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
    coverSrc: '/assets/showcases/creative-visuals/cover.png',
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
    coverSrc: '/assets/showcases/form-design/cover.png',
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
    coverSrc: '/assets/showcases/ip-scenario/cover.png',
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
    coverSrc: '/assets/showcases/dynamic-vision/cover.png',
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
      id: 'discount-poster',
      title: '折扣活动海报',
      description: '商业促销主题的创意主视觉，强调鲜明色彩和立体物件组合。',
      src: '/assets/showcases/creative-visuals/01.png',
      detailMedia: [
        '/assets/showcases/creative-visuals/discount-poster/01.png',
        '/assets/showcases/creative-visuals/discount-poster/02.png',
        '/assets/showcases/creative-visuals/discount-poster/03.png',
        '/assets/showcases/creative-visuals/discount-poster/04.png',
        '/assets/showcases/creative-visuals/discount-poster/05.png',
        '/assets/showcases/creative-visuals/discount-poster/06.png',
        '/assets/showcases/creative-visuals/discount-poster/07.png',
        '/assets/showcases/creative-visuals/discount-poster/08.png',
        '/assets/showcases/creative-visuals/discount-poster/09.png',
        '/assets/showcases/creative-visuals/discount-poster/10.png',
        '/assets/showcases/creative-visuals/discount-poster/11.png',
        '/assets/showcases/creative-visuals/discount-poster/12.png',
        '/assets/showcases/creative-visuals/discount-poster/13.png',
      ],
    },
    {
      id: 'type-poster-lab',
      title: '字体海报实验',
      description: '以黑色底板承载高对比排版与角色元素，探索展示型海报语言。',
      src: '/assets/showcases/creative-visuals/02.png',
    },
    {
      id: 'character-series',
      title: '趣味角色系列',
      description: '围绕玩偶角色做系列化视觉延展，形成统一又活泼的作品组。',
      src: '/assets/showcases/creative-visuals/03.png',
    },
    {
      id: 'yearbook-layout',
      title: '年度内容整理',
      description: '将年度项目以编辑化版式重新组合，形成更适合展示的网站封面页。',
      src: '/assets/showcases/creative-visuals/06.png',
    },
    {
      id: 'graphic-poster',
      title: '图形组合海报',
      description: '通过拼贴和图标化组织方式，让系列作品具备更强的系统辨识度。',
      src: '/assets/showcases/creative-visuals/07.png',
    },
  ],
  'form-design': [
    {
      id: 'music-theme-packaging',
      title: '音乐主题包装',
      description: '结合包装、电商和终端展示场景，强化视觉内容与产品氛围。',
      src: '/assets/showcases/form-design/01.png',
      detailMedia: [
        '/assets/showcases/form-design/music-theme-packaging/01.png',
        '/assets/showcases/form-design/music-theme-packaging/02.png',
        '/assets/showcases/form-design/music-theme-packaging/03.png',
        '/assets/showcases/form-design/music-theme-packaging/04.png',
        '/assets/showcases/form-design/music-theme-packaging/05.png',
        '/assets/showcases/form-design/music-theme-packaging/06.png',
        '/assets/showcases/form-design/music-theme-packaging/07.png',
        '/assets/showcases/form-design/music-theme-packaging/08.png',
      ],
    },
    {
      id: 'aigc-visual-study',
      title: 'AIGC 视觉探索',
      description: '通过高饱和配色与几何发散结构，形成实验感较强的视觉表达。',
      src: '/assets/showcases/form-design/02.png',
    },
  ],
  'ip-scenario': [
    {
      id: 'autumn-outing',
      title: '秋日出游',
      description: '围绕角色与场景道具展开的秋日主题主视觉探索。',
      src: '/assets/showcases/ip-scenario/01.png',
    },
    {
      id: 'end-of-2024',
      title: '年末包装',
      description: '以黑底与高对比色块构成的年末物料视觉组合。',
      src: '/assets/showcases/ip-scenario/02.png',
    },
    {
      id: 'balmy-autumn',
      title: '秋日拼贴',
      description: '将角色、道具与版式拼贴组合，形成更完整的场景表达。',
      src: '/assets/showcases/ip-scenario/03.png',
    },
    {
      id: 'christmas-character',
      title: '圣诞角色',
      description: '节日主题下的角色造型与氛围延展设计。',
      src: '/assets/showcases/ip-scenario/04.png',
    },
    {
      id: 'christmas-variation',
      title: '圣诞延展',
      description: '围绕同一形象进行配色和画面版本的延伸尝试。',
      src: '/assets/showcases/ip-scenario/05.png',
    },
    {
      id: 'christmas-collage',
      title: '冬日拼贴',
      description: '用节日元素、角色和图形模块搭建完整的场景海报。',
      src: '/assets/showcases/ip-scenario/06.png',
    },
  ],
  'dynamic-vision': [
    {
      id: 'scene-one',
      title: '第一幕',
      description: '动态视觉片段与角色镜头的节奏展示。',
      src: '/assets/showcases/dynamic-vision/01.mp4',
    },
  ],
};
