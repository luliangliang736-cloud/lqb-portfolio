/**
 * 从视频中抽取帧序列，用于鼠标定格动画
 * 用法：node scripts/extract-frames.mjs
 */
import ffmpegStatic from 'ffmpeg-static';
import { path as ffprobePath } from 'ffprobe-static';
import Ffmpeg from 'fluent-ffmpeg';
import { mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

Ffmpeg.setFfmpegPath(ffmpegStatic);

const INPUT = join(__dirname, '../public/assets/hero-media/4.mp4');
const OUTPUT_DIR = join(__dirname, '../public/assets/hero-frames');
const FPS = 12; // 每秒抽12帧，约60帧覆盖5秒视频，足够流畅

mkdirSync(OUTPUT_DIR, { recursive: true });

console.log(`\n正在从 4.mp4 抽取帧（${FPS}fps）...\n`);

Ffmpeg(INPUT)
  .setFfmpegPath(ffmpegStatic)
  .outputOptions([
    `-vf fps=${FPS},scale=1920:-2`,  // 保持原宽，高度等比
    '-q:v 3',                         // 图片质量（1最高，31最低）
  ])
  .output(join(OUTPUT_DIR, 'frame-%03d.jpg'))
  .on('progress', (p) => {
    if (p.frames) process.stdout.write(`\r已抽取 ${p.frames} 帧...`);
  })
  .on('end', () => {
    console.log('\n\n抽帧完成！文件保存在 public/assets/hero-frames/');
    console.log('下一步：运行 node scripts/convert-frames.mjs 转成 WebP');
  })
  .on('error', (err) => {
    console.error('抽帧失败:', err.message);
  })
  .run();
