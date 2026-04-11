import { useEffect, useState } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { accentMap, isVideoSrc, type ShowcaseItem, type ShowcaseMediaItem } from '../../content/showcases';

type ProjectDetailPageProps = {
  showcase: ShowcaseItem;
  project: ShowcaseMediaItem;
};

type ActiveImageState = {
  src: string;
  width: number;
  height: number;
} | null;

export default function ProjectDetailPage({ showcase, project }: ProjectDetailPageProps) {
  const colors = accentMap[showcase.accent];
  const projectMedia = project.detailMedia?.length ? project.detailMedia : [project.src];
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
    <main className="min-h-screen bg-surface-950 px-6 pt-28 pb-16">
      <div className="mx-auto max-w-7xl">
        <a
          href={`#showcase/${showcase.slug}`}
          className="inline-flex items-center gap-2 rounded-full border border-surface-700/70 bg-surface-900/60 px-4 py-2 text-sm text-surface-300 transition-colors hover:border-white/15 hover:text-surface-100"
        >
          <ArrowLeft size={16} />
          返回{showcase.title}
        </a>

        <section className={`mt-8 overflow-hidden rounded-[32px] border ${colors.border} bg-surface-900/45 p-8 md:p-10`}>
          <div className="max-w-4xl">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${colors.tag}`}>
              <showcase.icon size={12} />
              {showcase.tag}
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-surface-50 md:text-6xl">{project.title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-surface-400">{project.description}</p>
          </div>

          <div className="mt-10">
            <div className="columns-2 [column-gap:1rem] lg:columns-3 xl:columns-4">
              {projectMedia.map((src, index) => (
                <motion.article
                  key={`${project.id ?? project.title}-${index}`}
                  className="mb-4 inline-block w-full break-inside-avoid overflow-hidden rounded-[22px] border border-surface-800/60 bg-surface-900/55 align-top"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.06 }}
                >
                  {isVideoSrc(src) ? (
                    <video
                      src={src}
                      className="block h-auto w-full bg-surface-950/60 object-contain"
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
                        className="block h-auto w-full bg-surface-950/60 object-contain"
                      />
                    </button>
                  )}
                  <div className="px-4 py-3">
                    <p className="text-sm font-medium text-surface-200">
                      {projectMedia.length > 1 ? `${project.title} ${String(index + 1).padStart(2, '0')}` : project.title}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-surface-500">
                      {project.description}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>
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
              alt={`${project.title} 全屏预览`}
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
