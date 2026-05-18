import { toAssetPath } from '../utils/assetPath';

export type HeroMediaItem = {
  src: string;
  type: 'video' | 'image';
  alt?: string;
};

const withAssetPath = (item: HeroMediaItem): HeroMediaItem => ({
  ...item,
  src: toAssetPath(item.src),
});

// 首页首屏轮播媒体。
// 你以后如果想手动修改这一块，只改下面这两个数组就行：
// - `heroMediaDesktop`：桌面端完整轮播
// - `heroMediaMobile`：移动端精简轮播，尽量只保留最重要的 1-2 条
// - 按数组顺序轮播
// - 删掉一行就是移除一个媒体
// - 复制一行并改路径就是新增一个媒体
// 媒体文件统一放在 `public/assets/hero-media/` 下面，然后这里写 `/assets/hero-media/文件名`

export const heroMediaDesktop = ([
  { src: '/assets/hero-media/1.jpg', type: 'image', alt: '首页轮播 1' },
  { src: '/assets/hero-media/2.mp4', type: 'video' },
  { src: '/assets/hero-media/3.jpg', type: 'image', alt: '首页轮播 3' },
  { src: '/assets/hero-media/4.mp4', type: 'video' },
] satisfies HeroMediaItem[]).map(withAssetPath);

// 移动端只加载精简视频，减少首屏等待。
export const heroMediaMobile = ([
  { src: '/assets/hero-media/1.jpg', type: 'image', alt: '首页轮播 1' },
  { src: '/assets/hero-media/2.mp4', type: 'video' },
  { src: '/assets/hero-media/3.jpg', type: 'image', alt: '首页轮播 3' },
  { src: '/assets/hero-media/4.mp4', type: 'video' },
] satisfies HeroMediaItem[]).map(withAssetPath);
