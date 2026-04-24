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

function resolveAssetPath(src: string) {
  if (!src.startsWith('/assets/')) {
    return src;
  }

  const baseUrl = import.meta.env.BASE_URL || './';
  return `${baseUrl}${src.slice(1)}`;
}

function normalizeMediaItems(items: ShowcaseMediaItem[]): ShowcaseMediaItem[] {
  return items.map((item) => ({
    ...item,
    src: resolveAssetPath(item.src),
    detailMedia: item.detailMedia?.map(resolveAssetPath),
  }));
}

// 首页四个分类卡片的数据。
// 这里控制首页作品区看到的四个大卡片：
// - tag: 小标签
// - title: 首页大标题
// - description: 首页副标题
// - coverSrc: 首页封面图
// 如果你想改首页上看到的“创意视觉 / 构成设计 / IP及场景 / 动态视觉”，改这里。
const rawShowcases: ShowcaseItem[] = [
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
    title: '作品合集',
    description: '2019-2026设计工作轨迹，走过一些弯路依旧保持passion',
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
    title: 'TikTok Campaign Visuals',
    description: 'A creative key visual for a commercial promotion theme, emphasizing vivid colors and layered 3D object composition.',
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
    title: 'Typography Poster Lab',
    description: 'A black-base poster study combining high-contrast typography with character elements to explore display-driven poster language.',
    src: '/assets/showcases/creative-visuals/02.png',
  },
  {
    id: 'character-series',
    title: 'Playful Character Series',
    description: 'A series of visual extensions built around toy-like characters, creating a unified yet lively collection.',
    src: '/assets/showcases/creative-visuals/03.png',
  },
  {
    id: 'yearbook-layout',
    title: 'Annual Content Edit',
    description: 'Annual projects reorganized in an editorial layout to create a more presentation-friendly cover page.',
    src: '/assets/showcases/creative-visuals/06.png',
  },
  {
    id: 'graphic-poster',
    title: 'Graphic Composition Poster',
    description: 'A collage and icon-based composition system that gives the series a stronger visual identity.',
    src: '/assets/showcases/creative-visuals/07.png',
  },
];

const formDesignMedia: ShowcaseMediaItem[] = [
  {
    id: 'music-theme-packaging',
    title: 'Point-Line-Plane Study',
    description: 'A compositional study on the transformation and interplay of points, lines, and planes.',
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
    title: '3D and Point-Line Composition',
    description: 'An experimental visual built with high-saturation color and geometric expansion structures.',
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
    title: 'Autumn Outing',
    description: 'An autumn-themed key visual exploring characters and scene props in a cohesive composition.',
    src: '/assets/showcases/ip-scenario/01.png',
  },
  {
    id: 'end-of-2024',
    title: 'Year-End Packaging',
    description: 'A year-end visual set built with a dark base and high-contrast color blocks.',
    src: '/assets/showcases/ip-scenario/02.png',
  },
  {
    id: 'balmy-autumn',
    title: 'Autumn Collage',
    description: 'A fuller scene expression created by collaging characters, props, and layout elements together.',
    src: '/assets/showcases/ip-scenario/03.png',
  },
  {
    id: 'christmas-character',
    title: 'Christmas Character',
    description: 'Character styling and atmosphere extension design developed around a holiday theme.',
    src: '/assets/showcases/ip-scenario/04.png',
  },
  {
    id: 'christmas-variation',
    title: 'Christmas Extension',
    description: 'Color and layout variations expanding on the same character identity.',
    src: '/assets/showcases/ip-scenario/05.png',
  },
  {
    id: 'christmas-collage',
    title: 'Winter Collage',
    description: 'A complete scene poster built from holiday motifs, characters, and graphic modules.',
    src: '/assets/showcases/ip-scenario/06.png',
  },
];

const dynamicVisionMedia: ShowcaseMediaItem[] = [
  {
    id: 'scene-one',
    title: 'Scene One',
    description: 'A rhythmic presentation of motion-visual fragments and character-focused shots.',
    src: '/assets/showcases/dynamic-vision/01.mp4',
  },
];

const recentWorksMedia: ShowcaseMediaItem[] = [
  {
    title: 'Recent Collection 01',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (1).png',
  },
  {
    title: 'Recent Collection 02',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (2).png',
  },
  {
    title: 'Recent Collection 03',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (3).png',
  },
  {
    title: 'Recent Collection 04',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (4).png',
  },
  {
    title: 'Recent Collection 05',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (5).png',
  },
  {
    title: 'Recent Collection 06',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (6).png',
  },
  {
    title: 'Recent Collection 07',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (7).png',
  },
  {
    title: 'Recent Collection 08',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (8).png',
  },
  {
    title: 'Recent Collection 09',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (9).png',
  },
  {
    title: 'Recent Collection 10',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (10).png',
  },
  {
    title: 'Recent Collection 11',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (11).png',
  },
  {
    title: 'Recent Collection 12',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (12).png',
  },
  {
    title: 'Recent Collection 13',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (13).png',
  },
  {
    title: 'Recent Collection 14',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (14).png',
  },
  {
    title: 'Recent Collection 15',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (15).png',
  },
  {
    title: 'Recent Collection 16',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (16).png',
  },
  {
    title: 'Recent Collection 17',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (17).png',
  },
  {
    title: 'Recent Collection 18',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (18).png',
  },
  {
    title: 'Recent Collection 19',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (19).png',
  },
  {
    title: 'Recent Collection 20',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (20).png',
  },
  {
    title: 'Recent Collection 21',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (21).png',
  },
  {
    title: 'Recent Collection 22',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (22).png',
  },
  {
    title: 'Recent Collection 23',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (23).png',
  },
  {
    title: 'Recent Collection 24',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (24).png',
  },
  {
    title: 'Recent Collection 25',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (25).png',
  },
  {
    title: 'Recent Collection 26',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (26).png',
  },
  {
    title: 'Recent Collection 27',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (27).png',
  },
  {
    title: 'Recent Collection 28',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (28).png',
  },
  {
    title: 'Recent Collection 29',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (29).png',
  },
  {
    title: 'Recent Collection 30',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (30).png',
  },
  {
    title: 'Recent Collection 31',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (31).png',
  },
  {
    title: 'Recent Collection 32',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (32).png',
  },
  {
    title: 'Recent Collection 33',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (33).png',
  },
  {
    title: 'Recent Collection 34',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (34).png',
  },
  {
    title: 'Recent Collection 35',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (35).png',
  },
  {
    title: 'Recent Collection 36',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (36).png',
  },
  {
    title: 'Recent Collection 37',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (37).png',
  },
  {
    title: 'Recent Collection 38',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (38).png',
  },
  {
    title: 'Recent Collection 39',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (39).png',
  },
  {
    title: 'Recent Collection 40',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (40).png',
  },
  {
    title: 'Recent Collection 41',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (41).png',
  },
  {
    title: 'Recent Collection 42',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (42).png',
  },
  {
    title: 'Recent Collection 43',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (43).png',
  },
  {
    title: 'Recent Collection 44',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (44).png',
  },
  {
    title: 'Recent Collection 45',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (45).png',
  },
  {
    title: 'Recent Collection 46',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (46).png',
  },
  {
    title: 'Recent Collection 47',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (47).png',
  },
  {
    title: 'Recent Collection 48',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (48).png',
  },
  {
    title: 'Recent Collection 49',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (49).png',
  },
  {
    title: 'Recent Collection 50',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (50).png',
  },
  {
    title: 'Recent Collection 51',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (51).png',
  },
  {
    title: 'Recent Collection 52',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (52).png',
  },
  {
    title: 'Recent Collection 53',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (53).png',
  },
  {
    title: 'Recent Collection 54',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (54).png',
  },
  {
    title: 'Recent Collection 55',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (55).png',
  },
  {
    title: 'Recent Collection 56',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (56).png',
  },
  {
    title: 'Recent Collection 57',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (57).png',
  },
  {
    title: 'Recent Collection 58',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (58).png',
  },
  {
    title: 'Recent Collection 59',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (59).png',
  },
  {
    title: 'Recent Collection 60',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (60).png',
  },
  {
    title: 'Recent Collection 61',
    description: '',
    src: '/assets/showcases/recent-works/recent-collection/1 (61).png',
  },
];

const waterfallCollectionMedia: ShowcaseMediaItem[] = [
  {
    title: 'Green - Lu78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/archive-02.png',
  },
  {
    title: 'KV - Green Figure',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/archive-03.png',
  },
  {
    title: 'KV - Postproduction 1',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/archive-04.png',
  },
  {
    title: 'Music Time - Lu78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/archive-05.webp',
  },
  {
    title: 'T',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/archive-06.png',
  },
  {
    title: 'tt',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/archive-07.png',
  },
  {
    title: 'Simplifying Traditional Chinese - Lu78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/archive-08.png',
  },
  {
    title: 'Overseas Website Visual - Handcrafted Edition',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/archive-09.png',
  },
  {
    title: 'Long Time No See - Lu78 06-20',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/archive-10.png',
  },
  {
    title: 'Red Packet Cover 2 - Artboard 1 Copy',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/archive-11.jpg',
  },
  {
    title: 'Fragments of Notes - Lu78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/archive-12.png',
  },
  {
    title: 'Creative Brand Output - Artboard 1 Copy',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/archive-13.jpg',
  },
  {
    title: 'Ten Outfits with Nano in Three Minutes - Lu78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/archive-14.png',
  },
  {
    title: 'Wuyou IP Character - Pomelo Version',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/archive-15.jpg',
  },
  {
    title: 'Wuyou Night + Typography Design 2',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/archive-16.jpg',
  },
  {
    title: 'Summer Sticker Series 01',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/archive-17.jpg',
  },
  {
    title: 'Xiaohongshu - Artboard 1',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/archive-18.png',
  },
  {
    title: 'Xiaohongshu Green - Artboard 1 Copy 3',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/archive-19.png',
  },
  {
    title: 'Xiaohongshu Green - Artboard 1 Copy',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/archive-20.png',
  },
  {
    title: 'Xiaohongshu Green - Artboard 1',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/archive-21.png',
  },
  {
    title: 'Indonesian Local Life - Three UI Versions',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/archive-22.png',
  },
  {
    title: 'Rebuilding Creativity with AI - Lu78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/archive-23.png',
  },
  {
    title: 'Operational Visuals - Lu78',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/archive-24.png',
  },
  {
    title: 'White Base Composite 01',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/archive-25.png',
  },
  {
    title: 'White Base Composite 02',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/archive-26.png',
  },
  {
    title: 'White Base Composite 03',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/archive-27.png',
  },
  {
    title: 'White Base Composite 05',
    description: '',
    src: '/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/archive-28.png',
  },
];

const beyondDesignMedia: ShowcaseMediaItem[] = [
  {
    title: 'Clipboard - 2026-04-12 11.46.32',
    description: '',
    src: '/assets/showcases/Beyond Design/Beyond Design/Clipboard - 2026-04-12 11.46.32.png',
  },
];

const rawShowcaseMediaBySlug: Record<string, ShowcaseMediaItem[]> = {
  'creative-visuals': creativeVisualsMedia,
  'form-design': formDesignMedia,
  'ip-scenario': ipScenarioMedia,
  'dynamic-vision': dynamicVisionMedia,
  'waterfall-collection': waterfallCollectionMedia,
  'beyond-design': beyondDesignMedia,
};

export const showcases: ShowcaseItem[] = rawShowcases.map((item) => ({
  ...item,
  coverSrc: item.coverSrc ? resolveAssetPath(item.coverSrc) : item.coverSrc,
}));

export const showcaseMediaBySlug: Record<string, ShowcaseMediaItem[]> = Object.fromEntries(
  Object.entries(rawShowcaseMediaBySlug).map(([slug, items]) => [slug, normalizeMediaItems(items)]),
);

export const recentShowcaseMedia: ShowcaseMediaItem[] = normalizeMediaItems(recentWorksMedia);

