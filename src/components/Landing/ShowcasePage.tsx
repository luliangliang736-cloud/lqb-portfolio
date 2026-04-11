import { ArrowLeft, ExternalLink } from 'lucide-react';
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

export default function ShowcasePage({ showcase }: { showcase: ShowcaseItem }) {
  const colors = accentMap[showcase.accent];
  const mediaItems = showcaseMediaBySlug[showcase.slug] ?? [];

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
    </main>
  );
}
