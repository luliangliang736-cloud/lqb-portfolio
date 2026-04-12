import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: '首页', href: '#hero' },
  { label: '作品', href: '#features' },
];

const xiaohongshuUrl =
  'https://www.xiaohongshu.com/user/profile/621301760000000021029445?m_source=pwa';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/68 backdrop-blur-xl border-b border-white/8 shadow-lg shadow-black/30'
          : 'bg-black/42 backdrop-blur-lg border-b border-white/6'
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-2.5 group">
          <img
            src="/assets/site-icon.png"
            alt="LQB icon"
            className="w-8 h-8 rounded-lg object-cover shadow-lg shadow-black/20"
          />
          <img
            src="/assets/site-wordmark.svg"
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
          <a
            href={xiaohongshuUrl}
            className="text-sm font-medium tracking-[0.01em] px-5 py-2 rounded-full bg-[#FFB8DF] text-surface-950 hover:bg-[#FFCBE8] transition-colors"
            target="_blank"
            rel="noreferrer"
          >
            小红书
          </a>
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
            href={xiaohongshuUrl}
            className="block text-sm font-medium tracking-[0.01em] text-center px-5 py-2.5 rounded-full bg-[#FFB8DF] text-surface-950"
            target="_blank"
            rel="noreferrer"
            onClick={() => setMobileOpen(false)}
          >
            小红书
          </a>
        </motion.div>
      )}
    </motion.nav>
  );
}
