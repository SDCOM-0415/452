import { readdir, writeFile, readFile } from 'fs/promises';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { existsSync } from 'fs';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 读取图片目录
const picDir = join(__dirname, '../public/pic');
const outputFile = join(__dirname, '../public/photo-list.json');

try {
  // 读取现有的照片列表（如果存在）
  let existingImages = [];
  if (existsSync(outputFile)) {
    try {
      const data = await readFile(outputFile, 'utf8');
      existingImages = JSON.parse(data);
      console.log(`Found existing photo-list.json with ${existingImages.length} images`);
    } catch (readError) {
      console.warn('Warning: Could not parse existing photo-list.json, creating new file');
    }
  }

  // 读取目录中的所有文件
  const files = await readdir(picDir);

  // 过滤出图片文件
  const newImageFiles = files.filter(file => {
    const ext = extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);
  });

  // 创建一个集合来存储所有不重复的图片
  const uniqueImagesSet = new Set([...existingImages, ...newImageFiles]);
  const allImages = [...uniqueImagesSet];

  // 写入 JSON 文件
  await writeFile(outputFile, JSON.stringify(allImages, null, 2));
  
  const newImagesCount = allImages.length - existingImages.length;
  console.log(`Successfully updated photo-list.json with ${allImages.length} total images (${newImagesCount} new)`);
} catch (err) {
  console.error('Error:', err);
  process.exit(1);
}