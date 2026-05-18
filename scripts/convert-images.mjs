/**
 * 批量将 public/assets 下的 jpg/png 转为 WebP
 * 策略：quality 88 — 视觉无损，体积减少约 35~50%
 * 用法：node scripts/convert-images.mjs
 */

import sharp from 'sharp';
import { readdir, stat, mkdir } from 'fs/promises';
import { join, extname, basename, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = join(__dirname, '../public/assets');
const QUALITY = 88; // 88 分视觉几乎无损，可调到 90 更保守

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
    } else if (/\.(jpg|jpeg|png)$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

async function convertFile(src) {
  const ext = extname(src);
  const webpPath = src.replace(new RegExp(`${ext}$`, 'i'), '.webp');

  const srcStat = await stat(src);
  const image = sharp(src);
  await image.webp({ quality: QUALITY, effort: 4 }).toFile(webpPath);

  const destStat = await stat(webpPath);
  const saving = (((srcStat.size - destStat.size) / srcStat.size) * 100).toFixed(1);
  const arrow = destStat.size < srcStat.size ? '✓' : '~';
  console.log(
    `${arrow} ${src.replace(ASSETS_DIR, '').padEnd(55)} ` +
    `${(srcStat.size / 1024).toFixed(0)}KB → ${(destStat.size / 1024).toFixed(0)}KB  (-${saving}%)`
  );
}

const files = await walk(ASSETS_DIR);
console.log(`\n找到 ${files.length} 张图片，开始转换（WebP quality=${QUALITY}）...\n`);

let totalBefore = 0;
let totalAfter = 0;

for (const file of files) {
  try {
    const before = (await stat(file)).size;
    await convertFile(file);
    const webpPath = file.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    const after = (await stat(webpPath)).size;
    totalBefore += before;
    totalAfter += after;
  } catch (e) {
    console.error(`✗ 失败: ${file}`, e.message);
  }
}

const totalSaving = (((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1);
console.log(`\n完成！总计节省 ${((totalBefore - totalAfter) / 1024 / 1024).toFixed(2)} MB（-${totalSaving}%）`);
console.log(`原始: ${(totalBefore / 1024 / 1024).toFixed(2)} MB → WebP: ${(totalAfter / 1024 / 1024).toFixed(2)} MB`);
console.log(`\n注意：原始 jpg/png 文件保留未删除，确认效果后可手动清理。`);
