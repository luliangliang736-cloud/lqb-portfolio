import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { heroVideosDesktop, heroVideosMobile } from '../../content/heroMedia';

export default function Hero() {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 767px)').matches);
  const [activeIndex, setActiveIndex] = useState(0);
  const heroVideos = isMobile ? heroVideosMobile : heroVideosDesktop;

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
      className="relative h-[100svh] min-h-[100svh] overflow-hidden"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={heroVideos[activeIndex]}
          className="absolute inset-0"
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
