import { useEffect, useState } from 'react';
import { ArrowLeft, ChevronRight, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { accentMap, isVideoSrc, recentShowcaseMedia, showcaseMediaBySlug, showcases, type ShowcaseItem, type ShowcaseMediaItem } from '../../content/showcases';
import { toAssetPath } from '../../utils/assetPath';

const sectionLabels = [
  '封面精选',
  '过程稿',
  '方案延展',
  '视觉拆解',
  '应用场景',
  '更多内容',
];

type ActiveImageState = {
  src: string;
  width: number;
  height: number;
  title: string;
} | null;

type WaterfallSectionId = 'recent' | 'archive';

type WaterfallSection = {
  id: WaterfallSectionId;
  title: string;
  subtitle: string;
  description: string;
  items: ShowcaseMediaItem[];
  coverTitle?: string;
  coverSrc?: string;
};

const MAX_PREVIEW_SCALE = 3;

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

const showcaseHeadingMap: Record<string, string> = {
  'creative-visuals': 'Creative Design',
  'form-design': 'Form Design',
  'ip-scenario': 'IP & Scenario',
  'dynamic-vision': 'Dynamic Vision',
  'waterfall-collection': 'Work Collection',
  'beyond-design': 'Beyond Design',
};

const showcaseHeadingAccentCharMap: Record<string, string> = {
  'creative-visuals': 'g',
  'form-design': 'o',
  'ip-scenario': 'p',
  'dynamic-vision': 'v',
  'waterfall-collection': 'k',
  'beyond-design': 'y',
};

const continueBrowsingHeading = 'Continue browsing';
const continueBrowsingAccentChar = 'o';

const headingLineVariants = {
  rest: {
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
  },
  hover: {
    x: 18,
    y: -8,
    rotate: -1.2,
    scale: 1.02,
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
    ];

    return layouts[index] ?? layouts[0];
  },
};

function renderHeadingWithAccent(heading: string, accentChar: string | undefined, accentColorClass = 'text-[#9CFF3F]', keyPrefix = heading) {
  const normalizedAccentChar = accentChar?.toLowerCase();
  let accentApplied = false;
  let wordIndex = 0;

  return heading.split(' ').map((word, index) => {
    const currentWordIndex = wordIndex;
    wordIndex += 1;

    return (
      <motion.span
        key={`${keyPrefix}-${word}-${index}`}
        className="inline-block"
        variants={headingWordVariants}
        custom={currentWordIndex}
        transition={{ type: 'spring', stiffness: 260, damping: 18, mass: 0.8, delay: currentWordIndex * 0.02 }}
      >
        {word.split('').map((char, charIndex) => {
          const shouldAccent = !accentApplied && char.toLowerCase() === normalizedAccentChar;

          if (shouldAccent) {
            accentApplied = true;
          }

          return (
            <span key={`${keyPrefix}-${word}-${char}-${charIndex}`} className={shouldAccent ? accentColorClass : undefined}>
              {char}
            </span>
          );
        })}
        {index < heading.split(' ').length - 1 ? <span className="inline-block w-[0.22em]" aria-hidden="true" /> : null}
      </motion.span>
    );
  });
}

export default function ShowcasePage({ showcase }: { showcase: ShowcaseItem }) {
  const accentSurface = accentSurfaceMap[showcase.accent];
  const mediaItems = showcaseMediaBySlug[showcase.slug] ?? [];
  const usesWaterfallLayout = showcase.slug === 'waterfall-collection' || showcase.slug === 'beyond-design';
  const showcaseHeading = showcaseHeadingMap[showcase.slug] ?? showcase.title;
  const showcaseGridItems = mediaItems.length
    ? [
        ...mediaItems,
        ...Array.from({ length: (4 - (mediaItems.length % 4)) % 4 }, (_, index) => ({
          id: undefined,
          title: sectionLabels[(mediaItems.length + index) % sectionLabels.length] ?? `预留内容 ${index + 1}`,
          description: '这里可以继续放入该板块对应的作品封面、过程图、视频缩略图或案例详情。',
          src: '',
        })),
      ]
    : sectionLabels.map((label) => ({
        id: undefined,
        title: label,
        description: '这里可以继续放入该板块对应的作品封面、过程图、视频缩略图或案例详情。',
        src: '',
      }));
  const waterfallSections: WaterfallSection[] = showcase.slug === 'waterfall-collection'
    ? [
        {
          id: 'recent' as const,
          title: '近期作品',
          subtitle: 'Recent Work',
          description: '聚焦最近阶段推进的商业表达',
          coverSrc: toAssetPath('/assets/showcases/recent-works/cover.png?v=20260418b'),
          items: recentShowcaseMedia,
        },
        {
          id: 'archive' as const,
          title: '往期作品',
          subtitle: 'Selected Archive',
          description: '往日的工作设计片段及阶段性产出',
          coverTitle: '封面',
          coverSrc: toAssetPath('/assets/showcases/waterfallCollectionMedia/waterfallCollectionMedia/cover.png?v=20260418b'),
          items: mediaItems,
        },
      ]
    : [];
  const [activeImage, setActiveImage] = useState<ActiveImageState>(null);
  const [previewScale, setPreviewScale] = useState(1);
  const [openedWaterfallSection, setOpenedWaterfallSection] = useState<WaterfallSectionId | null>(null);
  const canZoomIn = previewScale < MAX_PREVIEW_SCALE;
  const canZoomOut = previewScale > 0.26;
  const currentWaterfallSection = waterfallSections.find((section) => section.id === openedWaterfallSection) ?? null;

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

  return (
    <main className="min-h-screen bg-surface-950 px-4 pt-28 pb-16 sm:px-5 lg:px-6 xl:px-8">
      <div className="mx-auto w-full max-w-[1560px]">
        <div className="mt-20 max-w-none px-1 md:mt-24 md:px-0">
          <motion.div
            className="mt-6 flex items-start justify-between gap-4"
            initial="rest"
            whileHover="hover"
          >
            <motion.h1
              className="text-[1.95rem] font-medium uppercase leading-[0.9] tracking-[-0.08em] text-[#F2F0E8] sm:text-[2.5rem] lg:text-[4.6rem] xl:text-[5.8rem]"
              variants={headingLineVariants}
              transition={{ type: 'spring', stiffness: 220, damping: 18, mass: 0.9 }}
            >
              {renderHeadingWithAccent(showcaseHeading, showcaseHeadingAccentCharMap[showcase.slug], 'text-[#9CFF3F]', showcase.slug)}
            </motion.h1>
            <motion.svg
              width="116"
              height="116"
              viewBox="0 0 116 116"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mt-1 h-9 w-9 shrink-0 sm:h-10 sm:w-10 lg:h-12 lg:w-12 xl:h-14 xl:w-14"
              aria-hidden="true"
              variants={{ rest: { scaleX: 1 }, hover: { scaleX: -1 } }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
            >
              <rect x="15.6719" y="84.0684" width="22.1632" height="22.1632" rx="4" transform="rotate(45 15.6719 84.0684)" fill="#D9D9D9" />
              <rect x="71.7207" y="84.0684" width="22.1632" height="22.1632" rx="4" transform="rotate(45 71.7207 84.0684)" fill="#D9D9D9" />
              <rect x="43.6914" y="84.0684" width="22.1632" height="22.1632" rx="4" transform="rotate(45 43.6914 84.0684)" fill="#D9D9D9" />
              <rect x="99.7402" y="84.0684" width="22.1632" height="22.1632" rx="4" transform="rotate(45 99.7402 84.0684)" fill="#D9D9D9" />
              <rect x="115.412" y="15.6719" width="22.1632" height="22.1632" rx="4" transform="rotate(135 115.412 15.6719)" fill="#D9D9D9" />
              <rect x="115.412" y="71.7207" width="22.1632" height="22.1632" rx="4" transform="rotate(135 115.412 71.7207)" fill="#D9D9D9" />
              <rect x="115.412" y="43.6914" width="22.1632" height="22.1632" rx="4" transform="rotate(135 115.412 43.6914)" fill="#D9D9D9" />
              <path d="M6.09675 15.7026L13.928 7.77433C15.4648 6.21843 17.9663 6.18522 19.5439 7.69977L84.3828 69.947C86.0246 71.5232 86.0222 74.1498 84.3775 75.723L75.0053 84.6877C73.434 86.1907 70.95 86.1632 69.4123 84.6259L6.11443 21.3423C4.55883 19.7871 4.55093 17.2676 6.09675 15.7026Z" fill="#D9D9D9" />
            </motion.svg>
          </motion.div>
        </div>

        <div className="mt-48 px-1 md:mt-56 md:px-0">
            {usesWaterfallLayout ? (
              mediaItems.length ? (
                <div className="space-y-8">
                  {showcase.slug === 'waterfall-collection' ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {waterfallSections.map((section, index) => {
                        const previewItem = section.coverSrc
                          ? { src: section.coverSrc, title: section.coverTitle ?? section.title }
                          : section.items[0];

                        return (
                        <motion.button
                          key={section.title}
                          type="button"
                          onClick={() => setOpenedWaterfallSection(section.id)}
                          className="g2-card-xl relative flex aspect-square w-full overflow-hidden border border-white/6 bg-[#0B0B0D] p-6 text-left shadow-xl shadow-black/15 transition-all duration-300 hover:border-white/12 hover:bg-[#0E0E11]"
                          initial={{ opacity: 0, y: 18 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35, delay: index * 0.06 }}
                        >
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(110,255,156,0.1),transparent_42%)]" />
                          <div className="relative flex h-full w-full flex-col">
                            <div>
                              <div className="flex items-start justify-between gap-4">
                                <h2 className="text-[22px] font-medium tracking-tight text-surface-50 md:text-[30px]">
                                  {section.title}
                                </h2>
                                <span className="inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-black/40 text-white/55 transition-colors group-hover:text-white/75">
                                  <ChevronRight size={12} />
                                </span>
                              </div>
                              <p className="mt-2.5 max-w-sm text-[11px] leading-relaxed text-surface-400 md:text-[13px]">
                                {section.description}
                              </p>
                            </div>
                            <div className="mt-5 flex min-h-0 flex-1 flex-col overflow-hidden rounded-[24px]">
                              {previewItem ? (
                                <div className="relative h-full min-h-[220px] overflow-hidden rounded-[24px]">
                                  {isVideoSrc(previewItem.src) ? (
                                    <video
                                      src={previewItem.src}
                                      className="block h-full w-full object-cover"
                                      autoPlay
                                      muted
                                      loop
                                      playsInline
                                    />
                                  ) : (
                                    <img
                                      src={previewItem.src}
                                      alt={section.coverSrc ? '' : previewItem.title}
                                      className="block h-full w-full object-cover"
                                    />
                                  )}
                                  {section.coverSrc ? null : (
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4">
                                      <p className="text-sm font-medium text-surface-50">
                                        {previewItem.title}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="flex h-full min-h-[220px] items-center justify-center rounded-[18px] border border-white/6 bg-black/20 px-6 text-center text-[12px] leading-relaxed text-surface-500 md:text-[13px]">
                                  近期作品内容后续会按你指定的文件夹填入
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.button>
                      )})}
                    </div>
                  ) : null}
                  {showcase.slug === 'waterfall-collection' ? null : (
                    <div className="columns-2 [column-gap:1rem] md:columns-5">
                      {mediaItems.map((item, index) => {
                        const Wrapper = item.id ? motion.a : motion.article;
                        const wrapperProps = item.id
                          ? { href: `#showcase/${showcase.slug}/project/${item.id}` }
                          : {};

                        return (
                          <Wrapper
                            key={`${showcase.slug}-${item.title}-${index}`}
                            {...wrapperProps}
                            className="g2-card-md mb-4 inline-block w-full break-inside-avoid bg-black/25 align-top shadow-xl shadow-black/10 transition-colors"
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: index * 0.04 }}
                          >
                            {isVideoSrc(item.src) ? (
                              <video
                                src={item.src}
                                className="block h-auto w-full bg-surface-950/60 object-cover"
                                autoPlay
                                muted
                                loop
                                playsInline
                              />
                            ) : (
                              <button
                                type="button"
                                onClick={() => openImagePreview(item.src, item.title)}
                                className="block w-full cursor-zoom-in overflow-hidden"
                                aria-label={`全屏查看 ${item.title}`}
                              >
                                <img
                                  src={item.src}
                                  alt={item.title}
                                  className="block h-auto w-full bg-surface-950/60 object-cover"
                                />
                              </button>
                            )}
                          </Wrapper>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div className="min-h-[260px]" />
              )
            ) : (
              <div className="grid grid-cols-2 items-start gap-4 md:grid-cols-4 lg:gap-5">
                {showcaseGridItems.map((item, index) => (
                  item.id ? (
                    <motion.a
                      key={`${showcase.slug}-${item.title}-${index}`}
                      href={`#showcase/${showcase.slug}/project/${item.id}`}
                      className="group g2-card-lg self-start bg-[#1E1E1E] p-4 transition-colors hover:bg-[#1E1E1E]"
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{
                        y: -10,
                        scale: 1.03,
                        rotateX: 3.6,
                        rotateY: index % 2 === 0 ? -3 : 3,
                        boxShadow: '0 26px 54px rgba(0,0,0,0.3)',
                      }}
                      transition={{ type: 'spring', stiffness: 170, damping: 18, mass: 1, delay: index * 0.06 }}
                      style={{ transformPerspective: 1400, transformStyle: 'preserve-3d' }}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-medium leading-5 text-surface-200 transition-colors duration-300 group-hover:text-surface-50">{item.title}</span>
                        <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-black/40 text-white/55 transition-colors duration-300 group-hover:bg-black/55 group-hover:text-white/75">
                          <ChevronRight size={10} />
                        </span>
                      </div>
                      {item.src ? (
                        isVideoSrc(item.src) ? (
                          <video
                            src={item.src}
                            className={`g2-card-md mt-4 block aspect-[3/4] w-full object-cover shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] ${accentSurface.media}`}
                            autoPlay
                            muted
                            loop
                            playsInline
                          />
                        ) : (
                          <img
                            src={item.src}
                            alt={item.title}
                            className={`g2-card-md mt-4 block aspect-[3/4] w-full object-cover shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] ${accentSurface.media}`}
                          />
                        )
                      ) : (
                        <div className={`g2-card-md mt-4 flex aspect-[3/4] items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] ${accentSurface.media}`}>
                          <showcase.icon size={28} className="text-surface-600 transition-colors duration-300 group-hover:text-surface-400" />
                        </div>
                      )}
                    </motion.a>
                  ) : (
                    <motion.article
                      key={`${showcase.slug}-${item.title}-${index}`}
                      className="group g2-card-lg self-start bg-[#1E1E1E] p-4"
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{
                        y: -8,
                        scale: 1.022,
                        rotateX: 3,
                        rotateY: index % 2 === 0 ? -2.4 : 2.4,
                        boxShadow: '0 22px 44px rgba(0,0,0,0.24)',
                      }}
                      transition={{ type: 'spring', stiffness: 170, damping: 18, mass: 1, delay: index * 0.06 }}
                      style={{ transformPerspective: 1400, transformStyle: 'preserve-3d' }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-surface-200 transition-colors duration-300 group-hover:text-surface-50">{item.title}</span>
                      </div>
                      {item.src ? (
                        isVideoSrc(item.src) ? (
                          <video
                            src={item.src}
                            className={`g2-card-md mt-4 block aspect-[3/4] w-full object-cover shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] ${accentSurface.media}`}
                            autoPlay
                            muted
                            loop
                            playsInline
                          />
                        ) : (
                          <img
                            src={item.src}
                            alt={item.title}
                            className={`g2-card-md mt-4 block aspect-[3/4] w-full object-cover shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] ${accentSurface.media}`}
                          />
                        )
                      ) : (
                        <div className={`g2-card-md mt-4 flex aspect-[3/4] items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] ${accentSurface.media}`}>
                          <showcase.icon size={28} className="text-surface-600 transition-colors duration-300 group-hover:text-surface-400" />
                        </div>
                      )}
                    </motion.article>
                  )
                ))}
              </div>
            )}
          </div>

          <div className="mt-10 flex justify-end">
            <a
              href="#features"
              className="inline-flex items-center gap-2 text-sm text-surface-300 transition-colors hover:text-surface-100"
            >
              <ArrowLeft size={16} />
              返回作品区
            </a>
          </div>

        <section className="mt-[12.5rem] px-1 md:px-0">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-[1.95rem] font-medium leading-[0.9] tracking-[-0.08em] text-[#F2F0E8] sm:text-[2.5rem] lg:text-[4.6rem] xl:text-[5.8rem]">
                {renderHeadingWithAccent(continueBrowsingHeading, continueBrowsingAccentChar, 'text-[#FFB8DF]', 'continue-browsing')}
              </h2>
            </div>
          </div>

          <div className="mt-[7.5rem] grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-3.5 xl:gap-4">
            {showcases.map((item) => {
              const itemColors = accentMap[item.accent];
              const isActive = item.slug === showcase.slug;

              return (
                <motion.a
                  key={item.slug}
                  href={`#showcase/${item.slug}`}
                  className={`group g2-card-lg relative overflow-hidden p-4 shadow-xl shadow-black/25 transition-colors xl:p-5 ${
                    isActive
                      ? `${itemColors.glow} bg-black/38`
                      : 'bg-black/42'
                  }`}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.035, y: -4 }}
                  transition={{ duration: 0.35 }}
                >
                  {item.coverSrc ? (
                    <>
                      <img
                        src={item.coverSrc}
                        alt={`${item.title} 封面`}
                        className="absolute inset-0 h-full w-full scale-[1.05] object-cover opacity-0 transition-all duration-500 ease-out group-hover:scale-100 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/72 to-black/28 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    </>
                  ) : null}
                  <div className="relative z-[1]">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${itemColors.tag}`}>
                      <item.icon size={12} />
                      {item.tag}
                    </span>
                    <div className="mt-4 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold text-surface-50 xl:text-lg">{item.title}</h3>
                        <p className="mt-2 text-xs leading-relaxed text-surface-400 transition-colors duration-300 group-hover:text-surface-200 xl:text-sm">
                          {item.description}
                        </p>
                      </div>
                      <ChevronRight
                        size={16}
                        className={`transition-colors duration-300 ${
                          isActive ? 'text-surface-300' : 'text-surface-500 group-hover:text-surface-300'
                        }`}
                      />
                    </div>
                  </div>
                </motion.a>
              );
            })}
          </div>
        </section>
      </div>

      {currentWaterfallSection ? (
        <div
          className="fixed inset-0 z-[75] flex items-center justify-center bg-black/88 px-4 py-8 backdrop-blur-sm"
          onClick={() => setOpenedWaterfallSection(null)}
        >
          <div
            className="relative max-h-[calc(100vh-4rem)] w-full max-w-7xl overflow-auto rounded-[var(--radius-g2-xl)] bg-[#0A0A0C] p-6 shadow-2xl shadow-black/40 md:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpenedWaterfallSection(null)}
              className="absolute top-5 right-5 inline-flex h-11 w-11 items-center justify-center text-surface-100 transition-colors hover:text-white/75"
              aria-label="关闭作品分组预览"
            >
              <X size={18} />
            </button>

            <div className="pr-14">
              <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-3xl font-semibold tracking-tight text-surface-50 md:text-5xl">
                    {currentWaterfallSection.title}
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-surface-400 md:text-[15px]">
                    {currentWaterfallSection.description}
                  </p>
                </div>
              </div>
            </div>

            {currentWaterfallSection.items.length ? (
              <div className="mt-8 columns-2 [column-gap:1rem] md:columns-5">
                {currentWaterfallSection.items.map((item, index) => {
                  const Wrapper = item.id ? motion.a : motion.article;
                  const wrapperProps = item.id
                    ? { href: `#showcase/${showcase.slug}/project/${item.id}` }
                    : {};

                  return (
                    <Wrapper
                      key={`${showcase.slug}-${currentWaterfallSection.id}-${item.title}-${index}`}
                      {...wrapperProps}
                      className="g2-card-md mb-4 inline-block w-full break-inside-avoid bg-black/25 align-top shadow-xl shadow-black/10 transition-colors"
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: index * 0.04 }}
                    >
                      {isVideoSrc(item.src) ? (
                        <video
                          src={item.src}
                          className="block h-auto w-full bg-surface-950/60 object-cover"
                          autoPlay
                          muted
                          loop
                          playsInline
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() => openImagePreview(item.src, item.title)}
                          className="block w-full cursor-zoom-in overflow-hidden"
                          aria-label={`全屏查看 ${item.title}`}
                        >
                          <img
                            src={item.src}
                            alt={item.title}
                            className="block h-auto w-full bg-surface-950/60 object-cover"
                          />
                        </button>
                      )}
                    </Wrapper>
                  );
                })}
              </div>
            ) : (
              <div className="mt-8 flex min-h-[320px] items-center justify-center rounded-[24px] border border-white/6 bg-black/18 px-6 text-center text-sm leading-relaxed text-surface-500">
                近期作品内容暂未填充，等你给我文件夹后我会补进去。
              </div>
            )}
          </div>
        </div>
      ) : null}

      {activeImage ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 px-4 py-8 backdrop-blur-sm"
          onClick={() => setActiveImage(null)}
        >
          <button
            type="button"
            onClick={() => setActiveImage(null)}
            className="absolute top-5 right-5 inline-flex h-11 w-11 items-center justify-center text-surface-100 transition-colors hover:text-white/75"
            aria-label="关闭全屏预览"
          >
            <X size={18} />
          </button>
          <div
            className="max-h-[calc(100vh-9rem)] max-w-full overflow-auto rounded-[var(--radius-g2-lg)]"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={activeImage.src}
              alt={`${activeImage.title} 全屏预览`}
              className="g2-card-lg object-contain shadow-2xl shadow-black/40"
              style={{
                width: `${Math.max(activeImage.width * previewScale, 1)}px`,
                height: `${Math.max(activeImage.height * previewScale, 1)}px`,
                maxWidth: 'none',
                maxHeight: 'none',
              }}
            />
          </div>
          <div
            className="absolute bottom-5 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/55 p-1.5 text-sm text-surface-100 shadow-lg shadow-black/30"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewScale((value) => Math.max(0.25, Number((value - 0.25).toFixed(2))))}
              disabled={!canZoomOut}
              className={`rounded-full px-3 py-2 transition-colors ${
                canZoomOut ? 'hover:bg-white/10' : 'cursor-not-allowed text-surface-500'
              }`}
            >
              缩小
            </button>
            <button
              type="button"
              onClick={() => setPreviewScale(1)}
              className="rounded-full px-3 py-2 transition-colors hover:bg-white/10"
            >
              1:1
            </button>
            <button
              type="button"
              onClick={() => setPreviewScale((value) => Math.min(MAX_PREVIEW_SCALE, Number((value + 0.25).toFixed(2))))}
              disabled={!canZoomIn}
              className={`rounded-full px-3 py-2 transition-colors ${
                canZoomIn ? 'hover:bg-white/10' : 'cursor-not-allowed text-surface-500'
              }`}
            >
              放大
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}
