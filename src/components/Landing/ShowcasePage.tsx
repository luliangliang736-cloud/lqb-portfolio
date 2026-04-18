import { useEffect, useState } from 'react';
import { ArrowLeft, ChevronRight, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { accentMap, isVideoSrc, showcaseMediaBySlug, showcases, type ShowcaseItem } from '../../content/showcases';

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

export default function ShowcasePage({ showcase }: { showcase: ShowcaseItem }) {
  const colors = accentMap[showcase.accent];
  const accentSurface = accentSurfaceMap[showcase.accent];
  const mediaItems = showcaseMediaBySlug[showcase.slug] ?? [];
  const usesWaterfallLayout = showcase.slug === 'waterfall-collection' || showcase.slug === 'beyond-design';
  const waterfallSections = showcase.slug === 'waterfall-collection'
    ? [
        {
          id: 'recent' as const,
          title: '近期作品',
          subtitle: 'Recent Work',
          description: '聚焦最近阶段推进的商业表达',
          items: [],
        },
        {
          id: 'archive' as const,
          title: '往期作品',
          subtitle: 'Selected Archive',
          description: '往日的工作设计片段及阶段性产出',
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
    <main className="min-h-screen bg-surface-950 px-6 pt-28 pb-16">
      <div className="mx-auto max-w-7xl">
        <a
          href="#features"
          className="inline-flex items-center gap-2 rounded-full border border-surface-700/70 bg-surface-900/60 px-4 py-2 text-sm text-surface-300 transition-colors hover:border-white/15 hover:text-surface-100"
        >
          <ArrowLeft size={16} />
          返回作品区
        </a>

        <section className="g2-card-xl mt-8 bg-surface-900/45 p-8 shadow-2xl shadow-black/20 md:p-10">
          <div className="max-w-3xl">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${colors.tag}`}>
              <showcase.icon size={12} />
              {showcase.tag}
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-surface-50 md:text-6xl">
              {showcase.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-surface-400">
              {showcase.description}
            </p>
          </div>

          <div className="mt-10">
            {usesWaterfallLayout ? (
              mediaItems.length ? (
                <div className="space-y-8">
                  {showcase.slug === 'waterfall-collection' ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {waterfallSections.map((section, index) => (
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
                                <span className="inline-flex h-6 w-14 shrink-0 items-center justify-end rounded-full bg-white/[0.05] pr-[3px] transition-colors group-hover:bg-white/[0.08]">
                                  <span className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-full bg-black/40 text-white/55 transition-colors group-hover:text-white/75">
                                    <ChevronRight size={12} />
                                  </span>
                                </span>
                              </div>
                              <p className="mt-2.5 max-w-sm text-[11px] leading-relaxed text-surface-400 md:text-[13px]">
                                {section.description}
                              </p>
                            </div>
                            <div className="mt-5 flex min-h-0 flex-1 flex-col overflow-hidden rounded-[24px] bg-black/22 p-2">
                              {section.items.length ? (
                                <div className="columns-3 gap-2 overflow-hidden">
                                  {section.items.slice(0, 9).map((item, itemIndex) => (
                                    <div
                                      key={`${section.id}-${item.title}-${itemIndex}`}
                                      className="mb-2 break-inside-avoid overflow-hidden rounded-[14px] bg-surface-950/70"
                                    >
                                      {isVideoSrc(item.src) ? (
                                        <video
                                          src={item.src}
                                          className="block h-auto w-full object-cover"
                                          autoPlay
                                          muted
                                          loop
                                          playsInline
                                        />
                                      ) : (
                                        <img
                                          src={item.src}
                                          alt={item.title}
                                          className="block h-auto w-full object-cover"
                                        />
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="flex h-full min-h-[220px] items-center justify-center rounded-[18px] border border-white/6 bg-black/20 px-6 text-center text-[12px] leading-relaxed text-surface-500 md:text-[13px]">
                                  近期作品内容后续会按你指定的文件夹填入
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.button>
                      ))}
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
              <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-3">
                {(mediaItems.length ? mediaItems : sectionLabels.map((label) => ({
                  id: undefined,
                  title: label,
                  description: '这里可以继续放入该板块对应的作品封面、过程图、视频缩略图或案例详情。',
                  src: '',
                }))).map((item, index) => (
                  item.id ? (
                    <motion.a
                      key={`${showcase.slug}-${item.title}-${index}`}
                      href={`#showcase/${showcase.slug}/project/${item.id}`}
                      className="group g2-card-lg self-start bg-[#060607] p-4 transition-colors hover:bg-[#09090B]"
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: index * 0.06 }}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-medium leading-5 text-surface-200">{item.title}</span>
                        <span className="inline-flex h-5 w-12 shrink-0 items-center justify-end rounded-full bg-white/[0.05] pr-[2px] transition-colors group-hover:bg-white/[0.08]">
                          <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-black/40 text-white/55 transition-colors group-hover:text-white/75">
                            <ChevronRight size={10} />
                          </span>
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
                          <showcase.icon size={28} className="text-surface-600" />
                        </div>
                      )}
                    </motion.a>
                  ) : (
                    <motion.article
                      key={`${showcase.slug}-${item.title}-${index}`}
                      className="g2-card-lg self-start bg-[#060607] p-4"
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: index * 0.06 }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-surface-200">{item.title}</span>
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
                          <showcase.icon size={28} className="text-surface-600" />
                        </div>
                      )}
                    </motion.article>
                  )
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="g2-card-xl mt-8 bg-surface-900/35 p-6 shadow-2xl shadow-black/20 md:p-8">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-surface-500">Showcases</p>
              <h2 className="mt-2 text-2xl font-semibold text-surface-50 md:text-3xl">继续浏览其它板块</h2>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {showcases.map((item) => {
              const itemColors = accentMap[item.accent];
              const isActive = item.slug === showcase.slug;

              return (
                <motion.a
                  key={item.slug}
                  href={`#showcase/${item.slug}`}
                  className={`group g2-card-lg relative overflow-hidden p-5 shadow-xl shadow-black/25 transition-colors ${
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
                        <h3 className="text-lg font-semibold text-surface-50">{item.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-surface-400 transition-colors duration-300 group-hover:text-surface-200">
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
