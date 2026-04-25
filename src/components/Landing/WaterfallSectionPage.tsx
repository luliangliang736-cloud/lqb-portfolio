import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { isVideoSrc, recentShowcaseMedia, showcaseMediaBySlug, type ShowcaseItem, type ShowcaseMediaItem } from '../../content/showcases';
import ImagePreviewOverlay from '../common/ImagePreviewOverlay';
import { toAssetPath } from '../../utils/assetPath';

export type WaterfallSectionId = 'recent' | 'archive';

type ActiveImageState = {
  src: string;
  width: number;
  height: number;
  title: string;
} | null;

type WaterfallSection = {
  id: WaterfallSectionId;
  title: string;
  description: string;
  items: ShowcaseMediaItem[];
};

type RecentCaseStudy = {
  id: string;
  title: string;
  kicker: string;
  summary: string;
  tags: string[];
  role: string;
  deliverables: string;
  meta: string;
  coverSrc: string;
  highlights: string[];
};

type WaterfallSectionPageProps = {
  showcase: ShowcaseItem;
  sectionId: WaterfallSectionId;
};

const MAX_PREVIEW_SCALE = 3;

const headingLineVariants = {
  rest: {
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
  },
  hover: (index: number) => {
    const layouts = [
      { x: 18, y: -8, rotate: -1.2, scale: 1.02 },
      { x: -22, y: 6, rotate: 0.8, scale: 0.995 },
      { x: 14, y: 14, rotate: -0.6, scale: 1.01 },
    ];

    return layouts[index] ?? layouts[0];
  },
};

const headingWordVariants = {
  rest: {
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
  },
  hover: (index: number) => {
    const layouts = [
      { x: -12, y: -8, rotate: -2.2, scale: 1.02 },
      { x: 16, y: 8, rotate: 1.4, scale: 0.985 },
      { x: -8, y: 12, rotate: -1.2, scale: 1.01 },
      { x: 14, y: -10, rotate: 2, scale: 1.03 },
      { x: -16, y: 6, rotate: -1.6, scale: 0.99 },
      { x: 10, y: 10, rotate: 1.1, scale: 1.015 },
      { x: -6, y: -12, rotate: -2, scale: 1.01 },
      { x: 12, y: 4, rotate: 1.8, scale: 0.99 },
    ];

    return layouts[index] ?? layouts[0];
  },
};

const accentSurfaceMap = {
  primary: {
    card: 'bg-[#0C110A]',
    media: 'bg-[#141C11]',
  },
  violet: {
    card: 'bg-[#110C12]',
    media: 'bg-[#19121B]',
  },
  emerald: {
    card: 'bg-[#091014]',
    media: 'bg-[#10181D]',
  },
  amber: {
    card: 'bg-[#121008]',
    media: 'bg-[#1A1710]',
  },
  rose: {
    card: 'bg-[#100B14]',
    media: 'bg-[#18111D]',
  },
  sky: {
    card: 'bg-[#09120D]',
    media: 'bg-[#111A15]',
  },
} as const;

export function isWaterfallSectionId(value: string | null): value is WaterfallSectionId {
  return value === 'recent' || value === 'archive';
}

function getWaterfallSections(showcase: ShowcaseItem): WaterfallSection[] {
  const mediaItems = showcaseMediaBySlug[showcase.slug] ?? [];

  if (showcase.slug !== 'waterfall-collection') {
    return [];
  }

  return [
    {
      id: 'recent',
      title: '近期作品',
      description: '聚焦最近阶段推进的商业表达',
      items: recentShowcaseMedia,
    },
    {
      id: 'archive',
      title: '往期作品',
      description: '往日的工作设计片段及阶段性产出',
      items: mediaItems,
    },
  ];
}

function getRecentCaseStudies(): RecentCaseStudy[] {
  const defaultRecentCaseCover = toAssetPath('/assets/showcases/recent-works/easycash-visual-renewal-cover.png');

  return [
    {
      id: 'case-01',
      title: 'Easycash Visual Renewal',
      kicker: 'Eashcash 海外官网视觉焕新',
      summary: '围绕Eashcash 八周年节点需求，对海外官网建立统一的视觉语调，并扩展到社媒，物料落地和触达，传达更加向新的金融活力',
      tags: ['Campaign', 'KV', 'Social'],
      role: 'Visual Direction / Key Visual',
      deliverables: 'KV、活动页主图、社媒图组',
      meta: '2025 / Commercial / Indonesia',
      coverSrc: defaultRecentCaseCover,
      highlights: [
        '强化促销传播识别度与统一视觉秩序',
        '兼顾品牌调性与投放转化需求',
      ],
    },
    {
      id: 'case-02',
      title: 'Seasonal Promotion Series',
      kicker: '节日节点促销视觉套组',
      summary: '以多版本促销内容为核心，统一系列化版式语言，让不同活动节点能在同一品牌框架内快速上线。',
      tags: ['Promotion', 'Retail', 'Digital'],
      role: 'Campaign Design / Asset System',
      deliverables: '促销海报、传播图组、活动横幅',
      meta: '2025 / Marketing / Multi-format',
      coverSrc: defaultRecentCaseCover,
      highlights: [
        '适配多尺寸多平台的高频更新节奏',
        '通过模块化结构提升延展效率',
      ],
    },
    {
      id: 'case-03',
      title: 'Product Landing Visual Refresh',
      kicker: '产品落地页与数字端表达优化',
      summary: '围绕产品卖点、操作流程与视觉氛围，重构页面核心信息层级，让品牌表达与使用场景更直观。',
      tags: ['Web', 'Product', 'Visual'],
      role: 'Art Direction / Web Visual',
      deliverables: '页面主视觉、模块图、卖点表达',
      meta: '2025 / Product Marketing / Web',
      coverSrc: defaultRecentCaseCover,
      highlights: [
        '提升产品信息的浏览效率',
        '让视觉语言更贴近实际使用场景',
      ],
    },
    {
      id: 'case-04',
      title: 'Character & 3D Expression',
      kicker: '角色与三维产品视觉实验',
      summary: '以角色感和空间感为主轴，探索更具记忆点的品牌表达方式，为商业项目提供更鲜明的视觉母题。',
      tags: ['3D', 'Character', 'Brand'],
      role: 'Concept Design / Visual Exploration',
      deliverables: '角色设定、场景图、视觉提案',
      meta: '2025 / Exploration / Brand Expression',
      coverSrc: defaultRecentCaseCover,
      highlights: [
        '通过形体与材质建立差异化识别',
        '让视觉风格可以继续延展到后续 Campaign',
      ],
    },
    {
      id: 'case-05',
      title: 'OOH & Spatial Touchpoints',
      kicker: '线下空间与户外触点展示',
      summary: '把线上主视觉延展到线下看板、空间介质与场景应用中，验证视觉系统在真实环境里的表现力。',
      tags: ['OOH', 'Spatial', 'Brand Rollout'],
      role: 'Application Design / Environment Visual',
      deliverables: '户外广告、场景贴图、空间延展',
      meta: '2025 / Offline Touchpoints / Display',
      coverSrc: defaultRecentCaseCover,
      highlights: [
        '让核心视觉在不同介质中保持统一',
        '提升场景化展示的真实感与代入感',
      ],
    },
    {
      id: 'case-06',
      title: 'AI-assisted Workflow Lab',
      kicker: 'AI 协同设计流程与内容产出实验',
      summary: '把 AI 作为创意协作与草图加速工具，探索从提案、出图到精修的工作流，验证效率与风格控制的平衡点。',
      tags: ['AI Workflow', 'Experiment', 'Creative System'],
      role: 'Workflow Design / Creative Experiment',
      deliverables: '流程测试、风格样张、方法沉淀',
      meta: '2025 / Experimental / Process Design',
      coverSrc: defaultRecentCaseCover,
      highlights: [
        '建立可重复使用的协同出图流程',
        '在效率提升之外保留审美判断与控制力',
      ],
    },
  ];
}

export default function WaterfallSectionPage({ showcase, sectionId }: WaterfallSectionPageProps) {
  const accentSurface = accentSurfaceMap[showcase.accent];
  const [activeImage, setActiveImage] = useState<ActiveImageState>(null);
  const [previewScale, setPreviewScale] = useState(1);
  const [columnCount, setColumnCount] = useState(() => (typeof window !== 'undefined' && window.innerWidth < 768 ? 2 : 5));
  const [mediaAspectRatios, setMediaAspectRatios] = useState<Record<string, number>>({});
  const sections = useMemo(() => getWaterfallSections(showcase), [showcase]);
  const currentSection = sections.find((section) => section.id === sectionId) ?? null;
  const canZoomIn = previewScale < MAX_PREVIEW_SCALE;
  const canZoomOut = previewScale > 0.26;
  const usesEditorialHero = currentSection?.id === 'recent' || currentSection?.id === 'archive';
  const usesRecentCaseList = currentSection?.id === 'recent';
  const usesDarkTheme = currentSection?.id === 'recent';
  const recentCaseStudies = useMemo(() => getRecentCaseStudies(), []);

  const masonryColumns = useMemo(() => {
    const items = currentSection?.items ?? [];
    const columns = Array.from({ length: columnCount }, () => ({
      height: 0,
      items: [] as Array<{ item: ShowcaseMediaItem; index: number }>,
    }));

    items.forEach((item, index) => {
      const estimatedHeight = mediaAspectRatios[item.src] ?? (isVideoSrc(item.src) ? 1.25 : 1.4);
      const targetColumnIndex = columns.reduce(
        (shortestIndex, column, currentIndex) => (column.height < columns[shortestIndex].height ? currentIndex : shortestIndex),
        0,
      );

      columns[targetColumnIndex].items.push({ item, index });
      columns[targetColumnIndex].height += estimatedHeight;
    });

    return columns.map((column) => column.items);
  }, [columnCount, currentSection?.items, mediaAspectRatios]);

  useEffect(() => {
    if (!activeImage) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveImage(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImage]);

  useEffect(() => {
    const updateColumnCount = () => {
      setColumnCount(window.innerWidth < 768 ? 2 : 5);
    };

    updateColumnCount();
    window.addEventListener('resize', updateColumnCount);
    return () => window.removeEventListener('resize', updateColumnCount);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const items = currentSection?.items ?? [];

    if (!items.length) {
      return undefined;
    }

    const loadAspectRatios = async () => {
      const results = await Promise.all(
        items.map((item) => new Promise<[string, number]>((resolve) => {
          if (isVideoSrc(item.src)) {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = () => {
              const ratio = video.videoWidth && video.videoHeight ? video.videoHeight / video.videoWidth : 1.25;
              resolve([item.src, ratio]);
            };
            video.onerror = () => resolve([item.src, 1.25]);
            video.src = item.src;
            return;
          }

          const image = new Image();
          image.onload = () => {
            const ratio = image.naturalWidth && image.naturalHeight ? image.naturalHeight / image.naturalWidth : 1.25;
            resolve([item.src, ratio]);
          };
          image.onerror = () => resolve([item.src, 1.25]);
          image.src = item.src;
        })),
      );

      if (!cancelled) {
        setMediaAspectRatios((current) => ({
          ...current,
          ...Object.fromEntries(results),
        }));
      }
    };

    void loadAspectRatios();

    return () => {
      cancelled = true;
    };
  }, [currentSection]);

  const openImagePreview = (src: string, title: string) => {
    const image = new Image();

    image.onload = () => {
      const fitScale = Math.min((window.innerWidth * 0.94) / image.naturalWidth, (window.innerHeight * 0.82) / image.naturalHeight, 1);

      setActiveImage({
        src,
        width: image.naturalWidth,
        height: image.naturalHeight,
        title,
      });
      setPreviewScale(fitScale);
    };

    image.src = src;
  };

  if (!currentSection) {
    return (
      <main className="min-h-screen bg-white px-4 pt-28 pb-16 sm:px-5 lg:px-6 xl:px-8">
        <div className="mx-auto mt-20 w-full max-w-[1560px] px-1 md:mt-24 md:px-0">
          <p className="text-sm text-slate-500">当前分组不存在。</p>
          <div className="mt-6">
            <a
              href={`#showcase/${showcase.slug}`}
              className="inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-900"
            >
              <ArrowLeft size={16} />
              返回{showcase.title}
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen px-4 pt-28 pb-16 sm:px-5 lg:px-6 xl:px-8 ${usesDarkTheme ? 'bg-surface-950' : 'bg-white'}`}>
      <div className="mx-auto w-full max-w-[1560px]">
        <section className="mt-20 px-1 md:mt-24 md:px-0">
          {usesEditorialHero ? (
            <div className="flex items-start justify-between gap-4">
              <motion.div
                className="relative"
                initial="rest"
                whileHover="hover"
              >
                <h1 className={`text-[1.95rem] font-medium uppercase leading-[0.9] tracking-[-0.08em] sm:text-[2.5rem] lg:text-[4.6rem] xl:text-[5.8rem] ${usesDarkTheme ? 'text-[#F2F0E8]' : 'text-slate-950'}`}>
                  <span className="block">
                    <motion.span
                      className="inline-block origin-left"
                      variants={headingLineVariants}
                      custom={0}
                      transition={{ type: 'spring', stiffness: 220, damping: 18, mass: 0.9 }}
                    >
                      <motion.span
                        className="inline-block"
                        variants={headingWordVariants}
                        custom={0}
                        transition={{ type: 'spring', stiffness: 260, damping: 18, mass: 0.8 }}
                      >
                        Recent
                      </motion.span>
                      <span className="inline-block w-[0.18em] lg:w-[0.22em]" aria-hidden="true" />
                      <motion.span
                        className="inline-block"
                        variants={headingWordVariants}
                        custom={1}
                        transition={{ type: 'spring', stiffness: 260, damping: 18, mass: 0.8, delay: 0.02 }}
                      >
                        W<span className="text-[#9CFF3F]">O</span>r<span className="text-[#9CFF3F]">K</span>s
                      </motion.span>
                    </motion.span>
                  </span>
                  <span className="mt-3 block lg:mt-4">
                    <motion.span
                      className="inline-flex origin-left items-baseline gap-[0.22em] lg:gap-[0.28em]"
                      variants={headingLineVariants}
                      custom={1}
                      transition={{ type: 'spring', stiffness: 220, damping: 18, mass: 0.9, delay: 0.02 }}
                    >
                      <motion.span
                        className="inline-block"
                        variants={headingWordVariants}
                        custom={2}
                        transition={{ type: 'spring', stiffness: 260, damping: 18, mass: 0.8 }}
                      >
                        Hey
                      </motion.span>
                      <motion.span
                        className="inline-block"
                        variants={headingWordVariants}
                        custom={3}
                        transition={{ type: 'spring', stiffness: 260, damping: 18, mass: 0.8, delay: 0.02 }}
                      >
                        Creative
                      </motion.span>
                      <motion.span
                        className="inline-block"
                        variants={headingWordVariants}
                        custom={4}
                        transition={{ type: 'spring', stiffness: 260, damping: 18, mass: 0.8, delay: 0.04 }}
                      >
                        Design
                      </motion.span>
                    </motion.span>
                  </span>
                  <span className="mt-3 block lg:mt-4">
                    <motion.span
                      className="inline-flex origin-left items-baseline gap-[0.2em] lg:gap-[0.26em]"
                      variants={headingLineVariants}
                      custom={2}
                      transition={{ type: 'spring', stiffness: 220, damping: 18, mass: 0.9, delay: 0.04 }}
                    >
                      <motion.span
                        className="inline-block"
                        variants={headingWordVariants}
                        custom={5}
                        transition={{ type: 'spring', stiffness: 260, damping: 18, mass: 0.8 }}
                      >
                        Just
                      </motion.span>
                      <motion.span
                        className="inline-block"
                        variants={headingWordVariants}
                        custom={6}
                        transition={{ type: 'spring', stiffness: 260, damping: 18, mass: 0.8, delay: 0.02 }}
                      >
                        For
                      </motion.span>
                      <motion.span
                        className="inline-block"
                        variants={headingWordVariants}
                        custom={7}
                        transition={{ type: 'spring', stiffness: 260, damping: 18, mass: 0.8, delay: 0.04 }}
                      >
                        <span className="text-[#FFB8DF]">@</span>Future
                      </motion.span>
                    </motion.span>
                  </span>
                </h1>
              </motion.div>
              <motion.svg
                width="116"
                height="116"
                viewBox="0 0 116 116"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`mt-1 h-9 w-9 shrink-0 sm:h-10 sm:w-10 lg:h-12 lg:w-12 xl:h-14 xl:w-14 ${usesDarkTheme ? 'text-[#D9D9D9]' : 'text-slate-900'}`}
                aria-hidden="true"
                whileHover={{ scaleX: -1 }}
                transition={{ duration: 0.28, ease: 'easeInOut' }}
              >
                <rect x="15.6719" y="84.0684" width="22.1632" height="22.1632" rx="4" transform="rotate(45 15.6719 84.0684)" fill="currentColor" />
                <rect x="71.7207" y="84.0684" width="22.1632" height="22.1632" rx="4" transform="rotate(45 71.7207 84.0684)" fill="currentColor" />
                <rect x="43.6914" y="84.0684" width="22.1632" height="22.1632" rx="4" transform="rotate(45 43.6914 84.0684)" fill="currentColor" />
                <rect x="99.7402" y="84.0684" width="22.1632" height="22.1632" rx="4" transform="rotate(45 99.7402 84.0684)" fill="currentColor" />
                <rect x="115.412" y="15.6719" width="22.1632" height="22.1632" rx="4" transform="rotate(135 115.412 15.6719)" fill="currentColor" />
                <rect x="115.412" y="71.7207" width="22.1632" height="22.1632" rx="4" transform="rotate(135 115.412 71.7207)" fill="currentColor" />
                <rect x="115.412" y="43.6914" width="22.1632" height="22.1632" rx="4" transform="rotate(135 115.412 43.6914)" fill="currentColor" />
                <path d="M6.09675 15.7026L13.928 7.77433C15.4648 6.21843 17.9663 6.18522 19.5439 7.69977L84.3828 69.947C86.0246 71.5232 86.0222 74.1498 84.3775 75.723L75.0053 84.6877C73.434 86.1907 70.95 86.1632 69.4123 84.6259L6.11443 21.3423C4.55883 19.7871 4.55093 17.2676 6.09675 15.7026Z" fill="currentColor" />
              </motion.svg>
            </div>
          ) : (
            <div>
              <h1 className={`text-[1.95rem] font-medium leading-[0.9] tracking-[-0.08em] sm:text-[2.5rem] lg:text-[4.6rem] xl:text-[5.8rem] ${usesDarkTheme ? 'text-[#F2F0E8]' : 'text-slate-950'}`}>
                {currentSection.title}
              </h1>
              <p className={`mt-3 max-w-2xl text-sm leading-relaxed md:text-[15px] ${usesDarkTheme ? 'text-surface-400' : 'text-slate-500'}`}>
                {currentSection.description}
              </p>
            </div>
          )}

          <div className={usesEditorialHero ? 'mt-60 md:mt-80' : 'mt-12 md:mt-16'}>
            {usesRecentCaseList ? (
              <div className="space-y-18 md:space-y-22">
                <div className="space-y-32 md:space-y-40">
                  {recentCaseStudies.map((caseStudy, index) => {
                    const isReversed = index % 2 === 1;

                    return (
                      <motion.article
                        key={caseStudy.id}
                        className="pt-8 md:pt-10"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: index * 0.06 }}
                      >
                        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-14">
                          <div className={`lg:col-span-5 ${isReversed ? 'lg:order-2' : ''}`}>
                            <div className="flex h-full flex-col">
                            <h2 className={`text-[1.7rem] font-medium leading-[0.95] tracking-[-0.06em] sm:text-[2rem] lg:text-[2.7rem] ${usesDarkTheme ? 'text-surface-50' : 'text-slate-950'}`}>
                              {index === 0 ? (
                                <>
                                  Ea<span className="text-[#9CFF3F]">s</span>ycash Visual
                                  {' '}
                                  <span className="text-[#9CFF3F]">R</span>enewal
                                </>
                              ) : (
                                caseStudy.title
                              )}
                            </h2>
                            <p className={`mt-4 text-[1.05rem] font-medium leading-relaxed md:text-[1.2rem] ${usesDarkTheme ? 'text-surface-200' : 'text-slate-700'}`}>
                              {caseStudy.kicker}
                            </p>
                            <p className={`mt-5 max-w-xl text-[0.82rem] leading-[1.82] font-normal md:text-[0.9rem] ${usesDarkTheme ? 'text-surface-400' : 'text-slate-500'}`}>
                              {caseStudy.summary}
                            </p>

                            <ul className={`mt-auto space-y-2 pt-8 text-sm leading-relaxed ${usesDarkTheme ? 'text-surface-300' : 'text-slate-700'}`}>
                              {caseStudy.highlights.map((highlight) => (
                                <li key={highlight} className="flex items-start gap-3">
                                  <span className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#9CFF3F]" />
                                  <span>{highlight}</span>
                                </li>
                              ))}
                            </ul>
                            </div>
                          </div>

                          <div className={`lg:col-span-7 ${isReversed ? 'lg:order-1' : ''}`}>
                            <div className={`group relative block w-full overflow-hidden rounded-[24px] ${accentSurface.card}`}>
                              <img
                                src={caseStudy.coverSrc}
                                alt={caseStudy.title}
                                className={`block w-full rounded-[24px] object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.025] aspect-[12/5] ${accentSurface.media}`}
                              />
                            </div>
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                </div>
              </div>
            ) : currentSection.items.length ? (
              <div
                className="grid gap-4"
                style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
              >
                {masonryColumns.map((column, columnIndex) => (
                  <div key={`${showcase.slug}-${currentSection.id}-column-${columnIndex}`} className="flex flex-col gap-4">
                    {column.map(({ item, index }) => {
                      const Wrapper = item.id ? motion.a : motion.article;
                      const wrapperProps = item.id
                        ? { href: `#showcase/${showcase.slug}/project/${item.id}` }
                        : {};

                      const isArchivePage = currentSection.id === 'archive';

                      return (
                        <Wrapper
                          key={`${showcase.slug}-${currentSection.id}-${item.title}-${index}`}
                          {...wrapperProps}
                          className={`w-full ${isArchivePage ? '' : `g2-card-md shadow-2xl shadow-black/20 ${accentSurface.card}`}`}
                          initial={{ opacity: 0, y: 18 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35, delay: index * 0.04 }}
                        >
                          {isVideoSrc(item.src) ? (
                            <video
                              src={item.src}
                              className={`block h-auto w-full object-contain ${isArchivePage ? 'rounded-[24px] shadow-none bg-transparent' : `shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] ${accentSurface.media}`}`}
                              autoPlay
                              muted
                              loop
                              playsInline
                            />
                          ) : (
                            <button
                              type="button"
                              onClick={() => openImagePreview(item.src, item.title)}
                              className="relative block w-full cursor-zoom-in overflow-hidden"
                              aria-label={`全屏查看 ${item.title}`}
                            >
                              <img
                                src={item.src}
                                alt={item.title}
                                className={`block h-auto w-full object-contain ${isArchivePage ? 'rounded-[24px] shadow-none bg-transparent' : `shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] ${accentSurface.media}`}`}
                              />
                            </button>
                          )}
                        </Wrapper>
                      );
                    })}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex min-h-[320px] items-center justify-center rounded-[24px] border border-slate-200 bg-slate-50 px-6 text-center text-sm leading-relaxed text-slate-500">
                当前分组还没有内容。
              </div>
            )}
          </div>

          <div className="mt-10 flex justify-end">
            <a
              href={`#showcase/${showcase.slug}`}
              className={`inline-flex items-center gap-2 text-sm transition-colors ${usesDarkTheme ? 'text-surface-300 hover:text-surface-100' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <ArrowLeft size={16} />
              返回{showcase.title}
            </a>
          </div>
        </section>
      </div>

      <ImagePreviewOverlay
        image={activeImage}
        scale={previewScale}
        maxScale={MAX_PREVIEW_SCALE}
        canZoomIn={canZoomIn}
        canZoomOut={canZoomOut}
        onScaleChange={setPreviewScale}
        onClose={() => setActiveImage(null)}
      />
    </main>
  );
}
