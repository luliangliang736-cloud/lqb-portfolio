import type { LucideIcon } from 'lucide-react';
import { Clapperboard, ImageIcon, LayoutTemplate, PenTool, Rows3, Sparkles } from 'lucide-react';

export type ShowcaseAccent = 'primary' | 'violet' | 'emerald' | 'amber' | 'rose' | 'sky';

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

// 首页四个分类卡片的数据。
// 这里控制首页作品区看到的四个大卡片：
// - tag: 小标签
// - title: 首页大标题
// - description: 首页副标题
// - coverSrc: 首页封面图
// 如果你想改首页上看到的“创意视觉 / 构成设计 / IP及场景 / 动态视觉”，改这里。
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
  {
    id: 'waterfall-collection',
    slug: 'waterfall-collection',
    icon: Rows3,
    tag: 'Waterfall Collection',
    title: '瀑布流合集',
    description: '连续浏览的多图内容集合，系列视觉与灵感碎片。',
    cta: '查看作品',
    accent: 'sky',
    coverSrc: '/assets/showcases/waterfallCollectionMedia/Cover.png',
  },
  {
    id: 'beyond-design',
    slug: 'beyond-design',
    icon: PenTool,
    tag: 'Beyond Design',
    title: '设计之外',
    description: '记录设计之外的观察、新时代AI技术探索。',
    cta: '查看作品',
    accent: 'rose',
    coverSrc: '/assets/showcases/Beyond Design/Cover.png',
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
  rose: {
    tag: 'text-[#B98EFF] bg-[#B98EFF]/10 border-[#B98EFF]/25',
    border: 'border-[#B98EFF]/18 hover:border-[#B98EFF]/35',
    glow: 'bg-[#B98EFF]/7',
    ctaBg: 'text-[#B98EFF] hover:text-[#CFB3FF]',
  },
  sky: {
    tag: 'text-[#6EFF9C] bg-[#6EFF9C]/10 border-[#6EFF9C]/25',
    border: 'border-[#6EFF9C]/18 hover:border-[#6EFF9C]/35',
    glow: 'bg-[#6EFF9C]/7',
    ctaBg: 'text-[#6EFF9C] hover:text-[#95FFB4]',
  },
};

// 下面这几组是每个分类详情页里的作品数据，不是首页四个大卡片。
// 这里控制的是“点进某个板块以后”看到的作品列表和作品详情：
// - title: 板块内某个作品的标题
// - description: 板块内某个作品的简介
// - src: 板块内作品列表的缩略图/封面图
// - detailMedia: 点进该作品后展示的详情图集，可放多张图片或视频路径
// 删除一个作品：删掉整个对象。
// 追加一个作品：复制一个对象后改 `id/title/description/src` 即可。

const creativeVisualsMedia: ShowcaseMediaItem[] = [
  {
    id: 'discount-poster',
    title: 'Tiktok运营视觉',
    description: '商业促销主题的创意主视觉，强调鲜明色彩和立体物件组合。',
    src: '/assets/showcases/creative-visuals/01.png',
    detailMedia: [
      '/assets/showcases/creative-visuals/discount-poster/KV - 绿人.png',
      '/assets/showcases/creative-visuals/discount-poster/KV-后期1.png',
      '/assets/showcases/creative-visuals/discount-poster/印尼本地生活-三个单独版本-UI_画板 1 副本.png',
      '/assets/showcases/creative-visuals/discount-poster/小红书-绿_画板 1 副本 3.png',
      '/assets/showcases/creative-visuals/discount-poster/小红书-绿_画板 1 副本.png',
      '/assets/showcases/creative-visuals/discount-poster/小红书-绿_画板 1.png',
      '/assets/showcases/creative-visuals/discount-poster/小红书_画板 1.png',
      '/assets/showcases/creative-visuals/discount-poster/整合-白色底-01.png',
      '/assets/showcases/creative-visuals/discount-poster/整合-白色底-02.png',
      '/assets/showcases/creative-visuals/discount-poster/整合-白色底-03.png',
      '/assets/showcases/creative-visuals/discount-poster/整合-白色底-05.png',
      '/assets/showcases/creative-visuals/discount-poster/长图_画板 1 副本 5.jpg',
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
];

const formDesignMedia: ShowcaseMediaItem[] = [
  {
    id: 'music-theme-packaging',
    title: '点线面构成',
    description: '点线面之间的互相转换和创意构成',
    src: '/assets/showcases/form-design/02.png',
    detailMedia: [
      '/assets/showcases/form-design/music-theme-packaging/01.png',
      '/assets/showcases/form-design/music-theme-packaging/02.png',
      '/assets/showcases/form-design/music-theme-packaging/03.png',
      '/assets/showcases/form-design/music-theme-packaging/04.png',
      '/assets/showcases/form-design/music-theme-packaging/05.png',
      '/assets/showcases/form-design/music-theme-packaging/06.png',
      '/assets/showcases/form-design/music-theme-packaging/07.png',
      '/assets/showcases/form-design/music-theme-packaging/08.png',
      '/assets/showcases/form-design/music-theme-packaging/10.png',
      '/assets/showcases/form-design/music-theme-packaging/Black - 陆78.png',
    ],
  },
  {
    id: 'box-heart',
    title: '三维与点线构成',
    description: '通过高饱和配色与几何发散结构，形成实验感较强的视觉表达。',
    src: '/assets/showcases/form-design/盒子心.png',
    detailMedia:[
      '/assets/showcases/form-design/box-heart/1 (1).png',
      '/assets/showcases/form-design/box-heart/1 (2).png',
      '/assets/showcases/form-design/box-heart/1 (3).png',
      '/assets/showcases/form-design/box-heart/1 (4).png',
      '/assets/showcases/form-design/box-heart/1 (5).png',
      '/assets/showcases/form-design/box-heart/1 (6).png',
      '/assets/showcases/form-design/box-heart/1 (7).png',
      '/assets/showcases/form-design/box-heart/1 (8).png',
      '/assets/showcases/form-design/box-heart/1 (9).png',

    ],
  },
];

const ipScenarioMedia: ShowcaseMediaItem[] = [
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
];

const dynamicVisionMedia: ShowcaseMediaItem[] = [
  {
    id: 'scene-one',
    title: '第一幕',
    description: '动态视觉片段与角色镜头的节奏展示。',
    src: '/assets/showcases/dynamic-vision/01.mp4',
  },
];

const waterfallCollectionMedia: ShowcaseMediaItem[] = [
  {
    title: 'Ai创意化视觉探索 - 陆78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/Ai创意化视觉探索 - 陆78.png',
  },
  {
    title: 'Ai是仆从不是牢笼 - 陆78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/Ai是仆从不是牢笼 - 陆78.png',
  },
  {
    title: 'AI毛毡 - 陆78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/AI毛毡 - 陆78.webp',
  },
  {
    title: 'Ai生成多人物风格化卡通动画实测 - 陆78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/Ai生成多人物风格化卡通动画实测 - 陆78.mp4',
  },
  {
    title: 'AI辅助的一些官网视觉 - 陆78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/AI辅助的一些官网视觉 - 陆78.png',
  },
  {
    title: 'ai风格化探索 - 陆78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/ai风格化探索 - 陆78.png',
  },
  {
    title: 'Ai风格化运营视觉 - 陆78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/Ai风格化运营视觉 - 陆78.png',
  },
  {
    title: 'Autumn Outing - 陆78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/Autumn Outing - 陆78.webp',
  },
  {
    title: 'Balmy Autumn - 陆78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/Balmy Autumn - 陆78.webp',
  },
  {
    title: 'Black - 陆78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/Black - 陆78.png',
  },
  {
    title: 'Clipboard - 2026-04-12 11.10.26',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/Clipboard - 2026-04-12 11.10.26.png',
  },
  {
    title: 'Clipboard - 2026-04-12 11.10.29',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/Clipboard - 2026-04-12 11.10.29.png',
  },
  {
    title: 'Clipboard - 2026-04-12 11.10.32',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/Clipboard - 2026-04-12 11.10.32.png',
  },
  {
    title: 'Clipboard - 2026-04-12 11.27.39',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/Clipboard - 2026-04-12 11.27.39.png',
  },
  {
    title: 'Clipboard - 2026-04-12 11.27.42',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/Clipboard - 2026-04-12 11.27.42.png',
  },
  {
    title: 'Coupons - 陆78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/Coupons - 陆78.webp',
  },
  {
    title: 'End of 2024 - 陆78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/End of 2024 - 陆78.webp',
  },
  {
    title: 'EXPLORE - 陆78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/EXPLORE - 陆78.webp',
  },
  {
    title: 'Free Gifts  - 陆78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/Free Gifts  - 陆78.webp',
  },
  {
    title: 'Green - 陆78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/Green - 陆78.png',
  },
  {
    title: 'KV - 绿人',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/KV - 绿人.png',
  },
  {
    title: 'KV-后期1',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/KV-后期1.png',
  },
  {
    title: 'Music Time - 陆78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/Music Time - 陆78.webp',
  },
  {
    title: 'Nano Pro生成风格化运营视觉 - 陆78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/Nano Pro生成风格化运营视觉 - 陆78.png',
  },
  {
    title: 'T',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/T.webp',
  },
  {
    title: 'Travel - 陆78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/Travel - 陆78.webp',
  },
  {
    title: '《时间之外》我的第一部动画MV - 陆78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/《时间之外》我的第一部动画MV - 陆78.mp4',
  },
  {
    title: '一点小东西 - 陆78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/一点小东西 - 陆78.png',
  },
  {
    title: '一组分镜海报 - 陆78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/一组分镜海报 - 陆78.png',
  },
  {
    title: '一键出拼豆丨10种材质合集 - 陆78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/一键出拼豆丨10种材质合集 - 陆78.png',
  },
  {
    title: '三分钟我用Ai做了一百套衣服 - 陆78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/三分钟我用Ai做了一百套衣服 - 陆78.png',
  },
  {
    title: '三分钟我用Nano做了十套衣服（附教程） - 陆78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/三分钟我用Nano做了十套衣服（附教程） - 陆78.png',
  },
  {
    title: '乘月 - 陆78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/乘月 - 陆78.webp',
  },
  {
    title: '创意设计合集 - 陆78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/创意设计合集 - 陆78.png',
  },
  {
    title: '动态丨多种材质效果转场 - 陆78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/动态丨多种材质效果转场 - 陆78.mp4',
  },
  {
    title: '印尼本地生活-三个单独版本-UI_画板 1 副本',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/印尼本地生活-三个单独版本-UI_画板 1 副本.png',
  },
  {
    title: '圣诞Christmas - 陆78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/圣诞Christmas - 陆78.webp',
  },
  {
    title: '圣诞情侣头像 - 陆78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/圣诞情侣头像 - 陆78.webp',
  },
  {
    title: '好久不见 - 陆7806-20',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/好久不见 - 陆7806-20.png',
  },
  {
    title: '小红书-绿_画板 1 副本 3',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/小红书-绿_画板 1 副本 3.png',
  },
  {
    title: '小红书-绿_画板 1 副本',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/小红书-绿_画板 1 副本.png',
  },
  {
    title: '小红书-绿_画板 1',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/小红书-绿_画板 1.png',
  },
  {
    title: '小红书_画板 1',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/小红书_画板 1.png',
  },
  {
    title: '年度总结丨记录2025那些手搓片段 - 陆78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/年度总结丨记录2025那些手搓片段 - 陆78.png',
  },
  {
    title: '心动冲出屏幕 - 陆78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/心动冲出屏幕 - 陆78.webp',
  },
  {
    title: '撞色 - 陆78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/撞色 - 陆78.png',
  },
  {
    title: '教程丨两步学会毛毡风格 - 陆78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/教程丨两步学会毛毡风格 - 陆78.png',
  },
  {
    title: '教程丨用Ai制作张力拉满的创意视觉 - 陆78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/教程丨用Ai制作张力拉满的创意视觉 - 陆78.png',
  },
  {
    title: '教程丨用Ai制作风格化视觉 - 陆78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/教程丨用Ai制作风格化视觉 - 陆78.png',
  },
  {
    title: '整合-白色底-01',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/整合-白色底-01.png',
  },
  {
    title: '整合-白色底-02',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/整合-白色底-02.png',
  },
  {
    title: '整合-白色底-03',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/整合-白色底-03.png',
  },
  {
    title: '整合-白色底-05',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/整合-白色底-05.png',
  },
  {
    title: '最近很火的大透视风格 - 陆78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/最近很火的大透视风格 - 陆78.png',
  },
  {
    title: '流动的线条边缘暗藏着蓬勃的生命力 - 陆78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/流动的线条边缘暗藏着蓬勃的生命力 - 陆78.png',
  },
  {
    title: '海外官网视觉丨手搓版 - 陆78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/海外官网视觉丨手搓版 - 陆78.png',
  },
  {
    title: '用Ai重构创意 - 陆78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/用Ai重构创意 - 陆78.png',
  },
  {
    title: '秋日出游 - 陆78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/秋日出游 - 陆78.png',
  },
  {
    title: '繁中取简 - 陆78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/繁中取简 - 陆78.png',
  },
  {
    title: '运营视觉 - 陆78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/运营视觉 - 陆78.png',
  },
  {
    title: '近期创意设计合集 - 陆78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/近期创意设计合集 - 陆78.mp4',
  },
  {
    title: '近期小结 - 陆78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/近期小结 - 陆78.webp',
  },
  {
    title: '近期探索 - 陆78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/近期探索 - 陆78.webp',
  },
  {
    title: '近期灵感合集 - 陆78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/近期灵感合集 - 陆78.webp',
  },
  {
    title: '长图_画板 1 副本 5',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/长图_画板 1 副本 5.jpg',
  },
  {
    title: '陆78 - 小红书',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/陆78 - 小红书.webp',
  },
  {
    title: '零碎的记录 - 陆78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/零碎的记录 - 陆78.png',
  },
  {
    title: '预告丨我的第一个IP - 陆78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/预告丨我的第一个IP - 陆78.mp4',
  },
  {
    title: '风格化探索 - 陆78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/风格化探索 - 陆78.png',
  },
];

const beyondDesignMedia: ShowcaseMediaItem[] = [
  {
    title: 'Clipboard - 2026-04-12 11.46.32',
    description: '',
    src: '/assets/showcases/Beyond Design/Beyond Design/Clipboard - 2026-04-12 11.46.32.png',
  },
];

export const showcaseMediaBySlug: Record<string, ShowcaseMediaItem[]> = {
  'creative-visuals': creativeVisualsMedia,
  'form-design': formDesignMedia,
  'ip-scenario': ipScenarioMedia,
  'dynamic-vision': dynamicVisionMedia,
  'waterfall-collection': waterfallCollectionMedia,
  'beyond-design': beyondDesignMedia,
};
