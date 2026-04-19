import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useMagneticMotion } from '../../hooks/useMagneticMotion';
import { toAssetPath } from '../../utils/assetPath';

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'Work', href: '#features' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMoreGalleryRoute, setIsMoreGalleryRoute] = useState(() => window.location.hash === '#more-gallery');
  const [navHovered, setNavHovered] = useState(false);
  const [navVisible, setNavVisible] = useState(() => window.location.hash !== '#more-gallery');
  const { x, y, handleMouseMove, handleMouseLeave } = useMagneticMotion({
    strength: 10,
    stiffness: 220,
    damping: 18,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const syncRoute = () => {
      const onMoreGalleryRoute = window.location.hash === '#more-gallery';
      setIsMoreGalleryRoute(onMoreGalleryRoute);
      setNavVisible(!onMoreGalleryRoute);
    };

    syncRoute();
    window.addEventListener('hashchange', syncRoute);
    return () => window.removeEventListener('hashchange', syncRoute);
  }, []);

  useEffect(() => {
    if (!isMoreGalleryRoute) {
      setNavVisible(true);
      return undefined;
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (mobileOpen) {
        setNavVisible(true);
        return;
      }

      if (event.buttons > 0) {
        return;
      }

      if (event.clientY <= 40) {
        setNavVisible(true);
        return;
      }

      if (!navHovered) {
        setNavVisible(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMoreGalleryRoute, mobileOpen, navHovered]);

  const shouldShowNav = !isMoreGalleryRoute || navVisible || navHovered || mobileOpen;

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/68 backdrop-blur-xl shadow-lg shadow-black/30'
          : 'bg-black/42 backdrop-blur-lg'
      } ${shouldShowNav ? 'pointer-events-auto' : 'pointer-events-none'}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{
        opacity: shouldShowNav ? 1 : 0,
        y: shouldShowNav ? 0 : -16,
      }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      onMouseEnter={() => {
        setNavHovered(true);
        if (isMoreGalleryRoute) {
          setNavVisible(true);
        }
      }}
      onMouseLeave={() => {
        setNavHovered(false);
        if (isMoreGalleryRoute && !mobileOpen) {
          setNavVisible(false);
        }
      }}
    >
      <div className="relative max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-2.5 group">
          <img
            src={toAssetPath('/assets/site-icon.png')}
            alt="LQB icon"
            className="w-8 h-8 rounded-lg object-cover shadow-lg shadow-black/20"
          />
          <img
            src={toAssetPath('/assets/site-wordmark.svg')}
            alt="LQB"
            className="block h-6 w-auto shrink-0 object-contain object-left"
          />
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium tracking-[0.01em] text-surface-400 hover:text-surface-50 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <motion.a
            href="#more-gallery"
            className="text-sm font-medium tracking-[0.01em] px-5 py-2 rounded-full bg-[#FFB8DF] text-surface-950 hover:bg-[#FFCBE8] transition-colors"
            style={{ x, y }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            whileTap={{ scale: 0.98 }}
          >
            Explore
          </motion.a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-surface-300 p-1 cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          className="md:hidden bg-surface-950/95 backdrop-blur-xl border-t border-surface-800/50 px-6 py-4 space-y-3"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block text-sm font-medium tracking-[0.01em] text-surface-400 hover:text-surface-50 py-2"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#more-gallery"
            className="block text-sm font-medium tracking-[0.01em] text-center px-5 py-2.5 rounded-full bg-[#FFB8DF] text-surface-950"
            onClick={() => setMobileOpen(false)}
          >
            Explore
          </a>
        </motion.div>
      )}
    </motion.nav>
  );
}
