import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative h-[100svh] min-h-[100svh] overflow-hidden"
    >
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <video
          src="/assets/hero-banner.mp4"
          className="block h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
      </motion.div>

    </section>
  );
}
