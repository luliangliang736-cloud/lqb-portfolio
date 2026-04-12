import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { heroVideos } from '../../content/heroMedia';

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroVideos.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

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
