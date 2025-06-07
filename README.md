# 毕业照片浏览应用

这是一个基于 Vue 3 开发的毕业照片浏览应用，提供照片分类、查看和管理功能。

## 功能特点

- 📸 照片网格展示
- 🔍 大图预览模式
- 📑 照片分类管理
- ⏱️ 按时间排序
- 🔄 照片导航（上一张/下一张）
- 📱 响应式设计
- 🖼️ 图片懒加载

## 技术栈

- Vue 3 - 渐进式 JavaScript 框架
- Vite - 下一代前端构建工具
- Vue Router - Vue.js 官方路由
- Naive UI - Vue 3 组件库
- VueUse - Vue 组合式 API 工具集
- Vue Lazyload - 图片懒加载

## 项目结构

```
photo-gallery/
├── public/                # 静态资源
│   ├── photo-list.json   # 照片列表配置
│   └── ...
├── src/
│   ├── components/       # 组件
│   │   └── PhotoList.vue # 照片列表组件
│   ├── views/           # 页面
│   │   └── HomeView.vue # 主页视图
│   ├── router/          # 路由配置
│   └── ...
└── scripts/
    └── generate-photo-list.js # 照片列表生成脚本
```

## 功能说明

### 照片浏览
- 网格式照片展示
- 点击照片可进入大图预览模式
- 支持在预览模式下切换上一张/下一张
- 显示照片拍摄时间和名称

### 分类管理
- 预设分类：全部、上午、下午、集体照、个人照
- 支持添加、删除和编辑分类
- 可为每张照片指定分类
- 分类数据本地持久化存储

### 照片信息
- 自动从照片文件名提取时间信息
- 根据时间自动分类（上午/下午）
- 支持按时间排序展示

## 开发设置

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 部署说明

1. 将毕业照片放置在 `public/pic/` 目录下
2. 运行照片列表生成脚本：
   ```bash
   node scripts/generate-photo-list.js
   ```
3. 构建项目：
   ```bash
   npm run build
   ```
4. 部署 `dist` 目录到 Web 服务器

## 照片命名规范

为了确保应用正确识别照片信息，照片文件名应遵循以下格式：
```
IMG_YYYYMMDD_HHMMSS.jpg
```
例如：`IMG_20250607_091127.jpg`

## 浏览器支持

- 支持所有现代浏览器
- 推荐使用最新版本的 Chrome、Firefox、Safari 或 Edge

## 注意事项

- 请确保照片文件名符合规范，以便系统正确提取时间信息
- "全部"分类为系统默认分类，不可删除
- 建议照片尺寸适中，以确保良好的加载性能