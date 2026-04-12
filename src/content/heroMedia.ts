// 首页首屏轮播视频。
// 你以后如果想手动修改这一块，只改下面这两个数组就行：
// - `heroVideosDesktop`：桌面端完整轮播
// - `heroVideosMobile`：移动端精简轮播，尽量只保留最重要的 1-2 条
// - 按数组顺序轮播
// - 删掉一行就是移除一个视频
// - 复制一行并改路径就是新增一个视频
// 视频文件建议放在 `public/assets/` 下面，然后这里写 `/assets/文件名.mp4`

export const heroVideosDesktop = [
  '/assets/hero-banner.mp4',
  '/assets/4月12日(1)-1.mp4',
  '/assets/4月12日(1)-4.mp4',
  '/assets/4月12日(1)-5.mp4',
  '/assets/4月12日(1)-9.mp4',
  '/assets/4月12日(1)-10.mp4',
];

// 移动端只加载精简视频，减少首屏等待。
export const heroVideosMobile = [
  '/assets/hero-banner.mp4',
  '/assets/4月12日(1)-1.mp4',
];
