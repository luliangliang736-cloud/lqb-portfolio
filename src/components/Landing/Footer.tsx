import { useRef } from 'react';
import { motion, useMotionTemplate, useScroll, useTransform } from 'framer-motion';
import { toAssetPath } from '../../utils/assetPath';

type FooterItem = {
  label: string;
  value: string;
  href?: string;
};

type FooterSection = {
  title: string;
  items: FooterItem[];
};

const personalSections: FooterSection[] = [
  {
    title: '个人信息',
    items: [
      { label: '身份', value: '创意探索者' },
      { label: '方向', value: 'AI创意' },
      { label: '状态', value: 'AI时代探索中' },
    ],
  },
  {
    title: '社媒主页',
    items: [
      { label: '小红书', value: '搜索“陆78', href: '#' },
      { label: 'Design', value: '暂无', href: '#' },
      { label: '微博 / 抖音', value: '暂无', href: '#' },
    ],
  },
  {
    title: '联系我',
    items: [
      { label: '邮箱', value: '15638439536@163.com', href: 'mailto:15638439536@163.com' },
      { label: '微信', value: 'lulelelulele520', href: 'wechat:lulelelulele520' },
      { label: '合作咨询', value: '欢迎通过邮箱或社媒联系', href: 'mailto:15638439536@163.com' },
    ],
  },
];

const socialLinks = [
  { label: '小红书', href: '#' },
  { label: 'Design', href: '#' },
  { label: 'GitHub', href: '#' },
];

const footerParallaxImage = toAssetPath('/assets/footer-parallax-4.png');

export default function Footer() {
  const parallaxRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: parallaxRef,
    offset: ['start 98%', 'end 18%'],
  });
  const parallaxScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.14, 1.03, 1.14]);
  const parallaxObjectY = useTransform(scrollYProgress, [0, 1], ['45%', '-17%']);
  const parallaxObjectPosition = useMotionTemplate`50% ${parallaxObjectY}`;

  return (
    <footer className="bg-surface-950 pt-8 sm:pt-10 lg:pt-12 xl:pt-14">
      <div
        ref={parallaxRef}
        className="relative left-1/2 mb-8 w-screen -translate-x-1/2 overflow-hidden bg-[#080809] sm:mb-10 lg:mb-12 xl:mb-14"
      >
        <motion.img
          src={footerParallaxImage}
          alt="Footer parallax cover"
          className="absolute inset-0 h-full w-full object-cover will-change-transform"
          style={{
            scale: parallaxScale,
            objectPosition: parallaxObjectPosition,
          }}
        />
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-12 lg:h-[280px] xl:h-[320px]">
          <div className="grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-[200px_repeat(3,minmax(0,200px))] lg:justify-between lg:gap-6 xl:grid-cols-[220px_repeat(3,minmax(0,220px))] xl:gap-8">
            <div className="max-w-[220px]">
              <div className="mb-4 flex min-h-8 items-center gap-2.5">
                <img
                  src={toAssetPath('/assets/site-icon.png')}
                  alt="LQB icon"
                  className="h-8 w-8 rounded-lg object-cover"
                />
                <img
                  src={toAssetPath('/assets/site-wordmark.svg')}
                  alt="LQB"
                  className="block h-7 w-auto shrink-0 object-contain object-left"
                />
              </div>
              <p className="text-[13px] leading-relaxed text-white/72 sm:text-sm">
                浪潮中思考与判断力愈发不可替⁠代⁠，无比的想象力和执行力
                <span className="block">才是Ai时代的人的核心</span>
              </p>
            </div>

            {personalSections.map((section) => (
              <div key={section.title} className="max-w-[220px]">
                <h4 className="mb-4 flex min-h-8 items-center text-[13px] font-medium text-white/88 sm:text-sm">{section.title}</h4>
                <ul className="space-y-3">
                  {section.items.map((item) => (
                    <li key={`${section.title}-${item.label}`} className="text-[13px] leading-relaxed sm:text-sm">
                      <span className="block text-white/42">{item.label}</span>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-white/72 transition-colors hover:text-white"
                          target={item.href.startsWith('http') ? '_blank' : undefined}
                          rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                        >
                          {item.value}
                        </a>
                      ) : (
                        <span className="text-white/72">{item.value}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 pt-3 pb-8 sm:px-6 sm:pb-10 lg:flex-row lg:pt-2 xl:pb-12">
          <span className="text-xs text-surface-600">
            &copy; {new Date().getFullYear()} LQB · 陆78创意化探索
          </span>
          <div className="flex items-center gap-5">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="text-xs text-surface-600 transition-colors hover:text-surface-400"
                target={social.href.startsWith('http') ? '_blank' : undefined}
                rel={social.href.startsWith('http') ? 'noreferrer' : undefined}
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
