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

export default function Footer() {
  return (
    <footer className="border-t border-surface-800/60 bg-surface-950">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[220px_repeat(3,minmax(0,220px))] md:justify-between md:gap-8">
          {/* Brand */}
          <div className="max-w-[220px]">
            <div className="mb-4 flex min-h-8 items-center gap-2.5">
              <img
                src="/assets/site-icon.png"
                alt="LQB icon"
                className="w-8 h-8 rounded-lg object-cover"
              />
              <img
                src="/assets/site-wordmark.svg"
                alt="LQB"
                className="block h-7 w-auto shrink-0 object-contain object-left"
              />
            </div>
            <p className="text-sm leading-relaxed text-surface-500">
              浪潮中思考与判断力愈发不可替代，无比的想象力和执行力才是Ai时代的人的核心。
            </p>
          </div>

          {personalSections.map((section) => (
            <div key={section.title} className="max-w-[220px]">
              <h4 className="mb-4 flex min-h-8 items-center text-sm font-medium text-surface-300">{section.title}</h4>
              <ul className="space-y-3">
                {section.items.map((item) => (
                  <li key={`${section.title}-${item.label}`} className="text-sm leading-relaxed">
                    <span className="block text-surface-600">{item.label}</span>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-surface-400 transition-colors hover:text-surface-200"
                        target={item.href.startsWith('http') ? '_blank' : undefined}
                        rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                      >
                        {item.value}
                      </a>
                    ) : (
                      <span className="text-surface-400">{item.value}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-16 pt-8 border-t border-surface-800/40 gap-4">
          <span className="text-xs text-surface-600">
            &copy; {new Date().getFullYear()} LQB · 陆78创意化探索
          </span>
          <div className="flex items-center gap-5">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="text-xs text-surface-600 hover:text-surface-400 transition-colors"
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
