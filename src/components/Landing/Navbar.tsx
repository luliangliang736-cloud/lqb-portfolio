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
  const [isArchiveSectionPage, setIsArchiveSectionPage] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [hoverReveal, setHoverReveal] = useState(false);
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
    const updateUiState = () => {
      setIsArchiveSectionPage(/^#showcase\/[^/]+\/section\/archive$/.test(window.location.hash));
      setIsDesktop(window.innerWidth >= 1024);
    };

    updateUiState();
    window.addEventListener('hashchange', updateUiState);
    window.addEventListener('resize', updateUiState);
    return () => {
      window.removeEventListener('hashchange', updateUiState);
      window.removeEventListener('resize', updateUiState);
    };
  }, []);

  const navShowsOnHover = isArchiveSectionPage && isDesktop && !mobileOpen;
  const navVisible = !navShowsOnHover || hoverReveal;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 ${navVisible ? 'h-20' : 'h-4'}`}
      onMouseEnter={() => {
        if (navShowsOnHover) {
          setHoverReveal(true);
        }
      }}
      onMouseLeave={() => {
        if (navShowsOnHover) {
          setHoverReveal(false);
        }
      }}
    >
      <motion.nav
        className={`transition-all duration-300 ${
          scrolled
            ? 'bg-black/68 backdrop-blur-xl shadow-lg shadow-black/30'
            : 'bg-black/42 backdrop-blur-lg'
        } ${navVisible ? 'pointer-events-auto' : 'pointer-events-none'}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: navVisible ? 1 : 0, y: navVisible ? 0 : -72 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >
        <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6">
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
          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 lg:flex xl:gap-8">
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
          <div className="hidden items-center gap-3 lg:flex">
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
            className="cursor-pointer p-1 text-surface-300 lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <motion.div
            className="space-y-3 border-t border-surface-800/50 bg-surface-950/95 px-5 py-4 backdrop-blur-xl sm:px-6 lg:hidden"
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
    </div>
  );
}
