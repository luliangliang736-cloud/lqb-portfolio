import { ArrowLeft, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { accentMap, type ShowcaseItem } from '../../content/showcases';

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
              {sectionLabels.map((label, index) => (
                <motion.article
                  key={label}
                  className="rounded-2xl border border-surface-800/70 bg-black/25 p-4"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.06 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-surface-200">{label}</span>
                    <ExternalLink size={14} className="text-surface-500" />
                  </div>
                  <div className="mt-4 flex aspect-[3/4] items-center justify-center rounded-xl border border-surface-800/60 bg-surface-950/60">
                    <showcase.icon size={28} className="text-surface-600" />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-surface-500">
                    这里可以继续放入该板块对应的作品封面、过程图、视频缩略图或案例详情。
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
