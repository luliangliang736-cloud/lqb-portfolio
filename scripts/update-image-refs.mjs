/**
 * 批量将 src 目录下所有文件中的图片引用（.jpg/.jpeg/.png）改为 .webp
 * 用法：node scripts/update-image-refs.mjs
 */

import { readdir, readFile, writeFile, stat } from 'fs/promises';
import { join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC_DIR = join(__dirname, '../src');

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
    } else if (/\.(tsx?|jsx?|ts|js|css|html)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

const files = await walk(SRC_DIR);
let totalChanged = 0;

for (const file of files) {
  const content = await readFile(file, 'utf-8');
  // 只替换 /assets/ 路径下的图片引用，避免误改其他字符串
  const updated = content.replace(
    /(\/assets\/[^"'`\s]+?)\.(jpg|jpeg|png)(?=["'`\s\)])/gi,
    '$1.webp'
  );

  if (updated !== content) {
    await writeFile(file, updated, 'utf-8');
    const count = (content.match(/(\/assets\/[^"'`\s]+?)\.(jpg|jpeg|png)/gi) || []).length;
    console.log(`✓ ${file.replace(SRC_DIR, 'src')}  (${count} 处)`);
    totalChanged += count;
  }
}

console.log(`\n完成！共更新 ${totalChanged} 处图片引用为 .webp`);
