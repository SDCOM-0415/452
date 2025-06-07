import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 源照片目录
const sourceDir = path.join(__dirname, '../../pic');
// 目标公共目录
const publicDir = path.join(__dirname, '../public');
// 目标照片目录
const targetPhotoDir = path.join(publicDir, 'pic');

// 确保目标目录存在
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

if (!fs.existsSync(targetPhotoDir)) {
  fs.mkdirSync(targetPhotoDir, { recursive: true });
}

// 删除文件或目录的函数
const removeFileOrDir = (path) => {
  if (fs.existsSync(path)) {
    const stat = fs.statSync(path);
    if (stat.isDirectory()) {
      const files = fs.readdirSync(path);
      files.forEach(file => {
        removeFileOrDir(path + '/' + file);
      });
      fs.rmdirSync(path);
    } else {
      fs.unlinkSync(path);
    }
  }
};

// 读取源目录中的所有照片
try {
  const files = fs.readdirSync(sourceDir);
  
  // 过滤出图片文件
  const photoFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
  });
  
  console.log(`找到 ${photoFiles.length} 张照片`);
  
  // 复制照片到公共目录
  photoFiles.forEach(file => {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetPhotoDir, file);
    
    // 复制文件
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`复制: ${file}`);
  });
  
  // 生成照片列表 JSON 文件
  const photoListPath = path.join(publicDir, 'photo-list.json');
  fs.writeFileSync(photoListPath, JSON.stringify(photoFiles, null, 2));
  
  console.log(`照片列表已生成: ${photoListPath}`);
  
  // 复制完成后删除源目录中的所有文件
  console.log('开始清理源目录...');
  files.forEach(file => {
    const filePath = path.join(sourceDir, file);
    fs.unlinkSync(filePath);
    console.log(`删除: ${file}`);
  });
  
  console.log('完成!');
} catch (error) {
  console.error('错误:', error);
  
  // 如果源目录不存在，创建一个空的照片列表
  if (error.code === 'ENOENT') {
    console.log('源目录不存在，创建空的照片列表');
    const photoListPath = path.join(publicDir, 'photo-list.json');
    fs.writeFileSync(photoListPath, JSON.stringify([], null, 2));
    console.log(`空照片列表已生成: ${photoListPath}`);
  }
}