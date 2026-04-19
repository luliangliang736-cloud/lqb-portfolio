import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { heroVideosDesktop, heroVideosMobile } from '../../content/heroMedia';

export default function Hero() {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 767px)').matches);
  const [activeIndex, setActiveIndex] = useState(0);
  const heroVideos = isMobile ? heroVideosMobile : heroVideosDesktop;
  const nextVideo = heroVideos[(activeIndex + 1) % heroVideos.length];

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (heroVideos.length <= 1) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroVideos.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [heroVideos]);

  useEffect(() => {
    if (activeIndex >= heroVideos.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, heroVideos.length]);

  return (
    <section
      id="hero"
      className="relative h-[100svh] min-h-[100svh] overflow-hidden bg-black"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={heroVideos[activeIndex]}
          className="absolute -inset-px"
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.01 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <video
            src={heroVideos[activeIndex]}
            className="block h-full w-full object-cover"
            preload={activeIndex === 0 ? 'auto' : 'metadata'}
            autoPlay
            muted
            loop
            playsInline
          />
        </motion.div>
      </AnimatePresence>

      {/* 移动端只预加载下一条视频，避免切换时黑屏等待。 */}
      {isMobile && heroVideos.length > 1 ? (
        <video
          key={nextVideo}
          src={nextVideo}
          preload="auto"
          muted
          playsInline
          aria-hidden="true"
          className="hidden"
        />
      ) : null}

      <div className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.16)_36%,rgba(0,0,0,0.38)_100%)]" />
      <div className="pointer-events-none absolute inset-0 z-[3] bg-[radial-gradient(circle_at_16%_56%,rgba(0,0,0,0.22),transparent_0_34%),radial-gradient(circle_at_24%_40%,rgba(255,255,255,0.04),transparent_0_18%),radial-gradient(circle_at_36%_50%,rgba(173,255,98,0.04),transparent_0_20%)]" />

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/18 px-3 py-2 backdrop-blur-sm">
        {heroVideos.map((video, index) => (
          <button
            key={video}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`h-2.5 rounded-full transition-all ${
              activeIndex === index ? 'w-8 bg-white' : 'w-2.5 bg-white/45 hover:bg-white/70'
            }`}
            aria-label={`切换到第 ${index + 1} 个视频`}
          />
        ))}
      </div>

    </section>
  );
}
