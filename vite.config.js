import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173,
    host: true, // 监听所有地址
    strictPort: false,
    open: true,
    cors: true,
    allowedHosts: ['cr4uz4teev-5173.cnb.run', '452.sdcom.top', '452.sdcom.asia', '452pic.netlify.app', 'localhost', '127.0.0.1'],
    fs: {
      strict: false, // 禁用严格的文件系统限制
      allow: ['..'] // 允许访问上级目录
    }
  },
  // 配置静态资源处理
  publicDir: 'public',
  base: './', // 使用相对路径
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        manualChunks: {
          'naive-ui': ['naive-ui'],
          'vue-vendor': ['vue', 'vue-router', '@vueuse/core']
        }
      }
    }
  }
})