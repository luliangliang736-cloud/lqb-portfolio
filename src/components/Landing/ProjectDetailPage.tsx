import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { isVideoSrc, type ShowcaseItem, type ShowcaseMediaItem } from '../../content/showcases';

type ProjectDetailPageProps = {
  showcase: ShowcaseItem;
  project: ShowcaseMediaItem;
};

type ActiveImageState = {
  src: string;
  width: number;
  height: number;
} | null;

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

const projectHeadingLineVariants = {
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

export default function ProjectDetailPage({ showcase, project }: ProjectDetailPageProps) {
  const accentSurface = accentSurfaceMap[showcase.accent];
  const projectMedia = project.detailMedia?.length ? project.detailMedia : [project.src];
  const [activeImage, setActiveImage] = useState<ActiveImageState>(null);
  const [previewScale, setPreviewScale] = useState(1);
  const [columnCount, setColumnCount] = useState(() => (typeof window !== 'undefined' && window.innerWidth < 768 ? 2 : 5));
  const [mediaAspectRatios, setMediaAspectRatios] = useState<Record<string, number>>({});
  const canZoomIn = previewScale < MAX_PREVIEW_SCALE;
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

    const loadAspectRatios = async () => {
      const results = await Promise.all(
        projectMedia.map((src) => new Promise<[string, number]>((resolve) => {
          if (isVideoSrc(src)) {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = () => {
              const ratio = video.videoWidth && video.videoHeight ? video.videoHeight / video.videoWidth : 1.25;
              resolve([src, ratio]);
            };
            video.onerror = () => resolve([src, 1.25]);
            video.src = src;
            return;
          }

          const image = new Image();
          image.onload = () => {
            const ratio = image.naturalWidth && image.naturalHeight ? image.naturalHeight / image.naturalWidth : 1.25;
            resolve([src, ratio]);
          };
          image.onerror = () => resolve([src, 1.25]);
          image.src = src;
        })),
      );

      if (!cancelled) {
        setMediaAspectRatios(Object.fromEntries(results));
      }
    };

    void loadAspectRatios();

    return () => {
      cancelled = true;
    };
  }, [projectMedia]);

  const masonryColumns = useMemo(() => {
    const columns = Array.from({ length: columnCount }, () => ({
      height: 0,
      items: [] as Array<{ src: string; index: number }>,
    }));

    projectMedia.forEach((src, index) => {
      const estimatedHeight = mediaAspectRatios[src] ?? (isVideoSrc(src) ? 1.25 : 1.4);
      const targetColumnIndex = columns.reduce(
        (shortestIndex, column, currentIndex) => (column.height < columns[shortestIndex].height ? currentIndex : shortestIndex),
        0,
      );

      columns[targetColumnIndex].items.push({ src, index });
      columns[targetColumnIndex].height += estimatedHeight;
    });

    return columns.map((column) => column.items);
  }, [columnCount, mediaAspectRatios, projectMedia]);

  const openImagePreview = (src: string) => {
    const image = new Image();

    image.onload = () => {
      const fitScale = Math.min((window.innerWidth * 0.94) / image.naturalWidth, (window.innerHeight * 0.82) / image.naturalHeight, 1);

      setActiveImage({
        src,
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
      setPreviewScale(fitScale);
    };

    image.src = src;
  };

  return (
    <main className="min-h-screen bg-surface-950 px-4 pt-28 pb-16 sm:px-5 lg:px-6 xl:px-8">
      <div className="mx-auto w-full max-w-[1560px]">
        <section className="mt-20 px-1 md:mt-24 md:px-0">
          <div className="max-w-none">
            <motion.div
              className="mt-6 flex items-start justify-between gap-4"
              initial="rest"
              whileHover="hover"
            >
              <motion.h1
                className="text-[1.95rem] font-medium leading-[0.9] tracking-[-0.08em] text-[#F2F0E8] sm:text-[2.5rem] lg:text-[4.6rem] xl:text-[5.8rem]"
                variants={projectHeadingLineVariants}
                transition={{ type: 'spring', stiffness: 220, damping: 18, mass: 0.9 }}
              >
                {project.title}
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

          <div className="mt-48 md:mt-56">
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
            >
              {masonryColumns.map((column, columnIndex) => (
                <div key={`${project.id ?? project.title}-column-${columnIndex}`} className="flex flex-col gap-4">
                  {column.map(({ src, index }) => (
                    <motion.article
                      key={`${project.id ?? project.title}-${index}`}
                      className={`g2-card-md w-full shadow-2xl shadow-black/20 ${accentSurface.card}`}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: index * 0.06 }}
                    >
                      {isVideoSrc(src) ? (
                        <video
                          src={src}
                          className={`block h-auto w-full object-contain shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] ${accentSurface.media}`}
                          controls
                          playsInline
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() => openImagePreview(src)}
                          className="relative block w-full cursor-zoom-in overflow-hidden"
                          aria-label={`全屏查看 ${project.title} ${index + 1}`}
                        >
                          <img
                            src={src}
                            alt={`${project.title} ${index + 1}`}
                            className={`block h-auto w-full object-contain shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] ${accentSurface.media}`}
                          />
                        </button>
                      )}
                    </motion.article>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex justify-end">
            <a
              href={`#showcase/${showcase.slug}`}
              className="inline-flex items-center gap-2 text-sm text-surface-300 transition-colors hover:text-surface-100"
            >
              <ArrowLeft size={16} />
              返回{showcase.title}
            </a>
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
            className="max-h-[calc(100vh-9rem)] max-w-full overflow-auto rounded-[var(--radius-g2-lg)]"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={activeImage.src}
              alt={`${project.title} 全屏预览`}
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
