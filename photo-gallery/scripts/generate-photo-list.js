import { readdir, writeFile } from 'fs/promises';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 读取图片目录
const picDir = join(__dirname, '../public/pic');
const outputFile = join(__dirname, '../public/photo-list.json');

try {
  // 读取目录中的所有文件
  const files = await readdir(picDir);

  // 过滤出图片文件
  const imageFiles = files.filter(file => {
    const ext = extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);
  });

  // 写入 JSON 文件
  await writeFile(outputFile, JSON.stringify(imageFiles, null, 2));
  console.log(`Successfully generated photo-list.json with ${imageFiles.length} images`);
} catch (err) {
  console.error('Error:', err);
  process.exit(1);
}