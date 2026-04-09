const footerLinks = {
  产品: ['功能介绍', '定价', '更新日志', '文档'],
  公司: ['关于我们', '博客', '新闻', '加入我们'],
  法律: ['使用条款', '隐私政策'],
};

export default function Footer() {
  return (
    <footer className="border-t border-surface-800/60 bg-surface-950">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm">
                K
              </div>
              <span className="text-lg font-semibold text-surface-50 tracking-tight">
                Kaya
              </span>
            </div>
            <p className="text-sm text-surface-500 leading-relaxed max-w-xs">
              设计部0号员工 — 以AI能力承接重复性设计任务，提升团队整体产能。
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-medium text-surface-300 mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-surface-500 hover:text-surface-300 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-16 pt-8 border-t border-surface-800/40 gap-4">
          <span className="text-xs text-surface-600">
            &copy; {new Date().getFullYear()} Kaya · 设计部0号员工
          </span>
          <div className="flex items-center gap-5">
            {['GitHub', 'Twitter', 'Discord'].map((social) => (
              <a
                key={social}
                href="#"
                className="text-xs text-surface-600 hover:text-surface-400 transition-colors"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
