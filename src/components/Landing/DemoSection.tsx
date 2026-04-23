import { useRef, type MouseEvent } from 'react';
import { MousePointer2 } from 'lucide-react';
import { motion, useInView, useTransform } from 'framer-motion';
import { toAssetPath } from '../../utils/assetPath';
import { useMagneticMotion } from '../../hooks/useMagneticMotion';
import InteractiveTitle from '../common/InteractiveTitle';

export default function DemoSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const { x, y, handleMouseMove, handleMouseLeave } = useMagneticMotion({
    strength: 10,
    stiffness: 180,
    damping: 20,
  });
  const rotateY = useTransform(x, [-14, 14], [-3, 3]);
  const rotateX = useTransform(y, [-14, 14], [3, -3]);
  const bannerVideoSrc = toAssetPath('/assets/demo-banner-lqb.mp4');
  const bannerPosterSrc = toAssetPath('/assets/demo-banner-lqb.webp');
  const primaryButtonHref = 'https://easycreative.netlify.app/';
  const secondaryButtonHref = '#';

  const handlePlaceholderClick = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (href === '#') {
      event.preventDefault();
    }
  };

  return (
    <section id="demo" className="relative px-6 pt-20 pb-44 md:pt-28 md:pb-56" ref={ref}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#FFB8DF]/8 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 38, filter: 'blur(10px)' }}
            animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.65, delay: 0.06 }}
          >
            <InteractiveTitle
              src={toAssetPath('/assets/lqb-ai-title.svg')}
              alt="与LQB数字人对话"
              className="mx-auto h-auto w-full max-w-[250px] object-contain"
            />
          </motion.div>
          <motion.p
            className="mt-4 text-lg text-surface-400"
            initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
            animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.6, delay: 0.16 }}
          >
            输入你的设计需求，体验 AI 设计助手的工作方式
          </motion.p>
        </div>

        <motion.div
          className="group relative w-full overflow-hidden rounded-[36px] shadow-2xl shadow-black/35 transition-shadow duration-500 hover:shadow-[0_26px_60px_rgba(0,0,0,0.35)]"
          initial={{ opacity: 0, y: 54, scale: 0.965, filter: 'blur(12px)' }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.75, delay: 0.22 }}
          style={{
            x,
            y,
            rotateX,
            rotateY,
            transformPerspective: 1400,
            transformStyle: 'preserve-3d',
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className="relative w-full overflow-hidden rounded-[36px]"
            style={{ clipPath: 'inset(0 round 36px)' }}
          >
            <video
              src={bannerVideoSrc}
              poster={bannerPosterSrc}
              className="block aspect-[16/9] w-full rounded-[36px] object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="LQB 作品横幅视频"
            />
            <div className="absolute inset-x-0 bottom-[11%] z-10 flex justify-center px-6">
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href={primaryButtonHref}
                  onClick={(event) => handlePlaceholderClick(event, primaryButtonHref)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-14 items-center gap-3 rounded-full bg-white px-8 text-lg font-semibold text-black shadow-[0_14px_32px_rgba(0,0,0,0.18)] transition-transform duration-300 hover:scale-[1.02]"
                >
                <MousePointer2 size={22} strokeWidth={2.2} className="-scale-x-100" />
                  <span>开始创作</span>
                </a>
                <a
                  href={secondaryButtonHref}
                  onClick={(event) => handlePlaceholderClick(event, secondaryButtonHref)}
                  className="inline-flex h-14 items-center rounded-full bg-black/38 px-10 text-lg font-semibold text-white/88 backdrop-blur-sm transition-transform duration-300 hover:scale-[1.02] hover:bg-black/46"
                >
                  了解更多
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
