import { useEffect, useState } from 'react';
import { ArrowLeft, ExternalLink, X } from 'lucide-react';
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

export default function ShowcasePage({ showcase }: { showcase: ShowcaseItem }) {
  const colors = accentMap[showcase.accent];
  const mediaItems = showcaseMediaBySlug[showcase.slug] ?? [];
  const usesWaterfallLayout = showcase.slug === 'waterfall-collection' || showcase.slug === 'beyond-design';
  const [activeImage, setActiveImage] = useState<ActiveImageState>(null);
  const [previewScale, setPreviewScale] = useState(1);
  const canZoomIn = previewScale < 0.99;
  const canZoomOut = previewScale > 0.26;

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

        <section className={`mt-8 overflow-hidden rounded-[32px] border ${colors.border} bg-surface-900/45 p-8 md:p-10`}>
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

          <div className={`mt-10 rounded-[28px] border border-surface-800/60 ${colors.glow} p-6 md:p-8`}>
            {usesWaterfallLayout ? (
              mediaItems.length ? (
                <div className="columns-2 [column-gap:1rem] lg:columns-3 xl:columns-4">
                  {mediaItems.map((item, index) => {
                    const Wrapper = item.id ? motion.a : motion.article;
                    const wrapperProps = item.id
                      ? { href: `#showcase/${showcase.slug}/project/${item.id}` }
                      : {};

                    return (
                      <Wrapper
                        key={`${showcase.slug}-${item.title}-${index}`}
                        {...wrapperProps}
                        className="mb-4 inline-block w-full break-inside-avoid overflow-hidden rounded-[22px] border border-surface-800/70 bg-black/25 align-top transition-colors hover:border-white/12"
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
                <div className="min-h-[260px]" />
              )
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
                      className="rounded-2xl border border-surface-800/70 bg-black/25 p-4 transition-colors hover:border-white/12"
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: index * 0.06 }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-surface-200">{item.title}</span>
                        <ExternalLink size={14} className="text-surface-500" />
                      </div>
                      {item.src ? (
                        isVideoSrc(item.src) ? (
                          <video
                            src={item.src}
                            className="mt-4 block aspect-[3/4] w-full rounded-xl border border-surface-800/60 bg-surface-950/60 object-cover"
                            autoPlay
                            muted
                            loop
                            playsInline
                          />
                        ) : (
                          <img
                            src={item.src}
                            alt={item.title}
                            className="mt-4 block aspect-[3/4] w-full rounded-xl border border-surface-800/60 object-cover bg-surface-950/60"
                          />
                        )
                      ) : (
                        <div className="mt-4 flex aspect-[3/4] items-center justify-center rounded-xl border border-surface-800/60 bg-surface-950/60">
                          <showcase.icon size={28} className="text-surface-600" />
                        </div>
                      )}
                      <p className="mt-3 text-sm leading-relaxed text-surface-500">
                        {item.description}
                      </p>
                    </motion.a>
                  ) : (
                    <motion.article
                      key={`${showcase.slug}-${item.title}-${index}`}
                      className="rounded-2xl border border-surface-800/70 bg-black/25 p-4"
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: index * 0.06 }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-surface-200">{item.title}</span>
                        <ExternalLink size={14} className="text-surface-500" />
                      </div>
                      {item.src ? (
                        isVideoSrc(item.src) ? (
                          <video
                            src={item.src}
                            className="mt-4 block aspect-[3/4] w-full rounded-xl border border-surface-800/60 bg-surface-950/60 object-cover"
                            autoPlay
                            muted
                            loop
                            playsInline
                          />
                        ) : (
                          <img
                            src={item.src}
                            alt={item.title}
                            className="mt-4 block aspect-[3/4] w-full rounded-xl border border-surface-800/60 object-cover bg-surface-950/60"
                          />
                        )
                      ) : (
                        <div className="mt-4 flex aspect-[3/4] items-center justify-center rounded-xl border border-surface-800/60 bg-surface-950/60">
                          <showcase.icon size={28} className="text-surface-600" />
                        </div>
                      )}
                      <p className="mt-3 text-sm leading-relaxed text-surface-500">
                        {item.description}
                      </p>
                    </motion.article>
                  )
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="mt-8 rounded-[32px] border border-surface-800/70 bg-surface-900/35 p-6 md:p-8">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-surface-500">Showcases</p>
              <h2 className="mt-2 text-2xl font-semibold text-surface-50 md:text-3xl">继续浏览其它板块</h2>
            </div>
            <p className="max-w-2xl text-sm leading-relaxed text-surface-400">
              当前已经进入作品详情页，下面四个板块仍然可以直接点击切换浏览。
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {showcases.map((item) => {
              const itemColors = accentMap[item.accent];
              const isActive = item.slug === showcase.slug;

              return (
                <motion.a
                  key={item.slug}
                  href={`#showcase/${item.slug}`}
                  className={`rounded-2xl border p-5 transition-colors ${
                    isActive
                      ? `${itemColors.border} ${itemColors.glow}`
                      : 'border-surface-800/70 bg-black/20 hover:border-white/12'
                  }`}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${itemColors.tag}`}>
                    <item.icon size={12} />
                    {item.tag}
                  </span>
                  <div className="mt-4 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-surface-50">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-surface-400">{item.description}</p>
                    </div>
                    <ExternalLink size={16} className={isActive ? 'text-surface-300' : 'text-surface-500'} />
                  </div>
                </motion.a>
              );
            })}
          </div>
        </section>
      </div>

      {activeImage ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 px-4 py-8 backdrop-blur-sm"
          onClick={() => setActiveImage(null)}
        >
          <button
            type="button"
            onClick={() => setActiveImage(null)}
            className="absolute top-5 right-5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/45 text-surface-100 transition-colors hover:border-white/20 hover:bg-black/65"
            aria-label="关闭全屏预览"
          >
            <X size={18} />
          </button>
          <div
            className="max-h-[calc(100vh-9rem)] max-w-full overflow-auto rounded-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={activeImage.src}
              alt={`${activeImage.title} 全屏预览`}
              className="rounded-2xl object-contain shadow-2xl shadow-black/40"
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
              onClick={() => setPreviewScale((value) => Math.min(1, Number((value + 0.25).toFixed(2))))}
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
