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
    host: '0.0.0.0',
    strictPort: false,
    open: true,
    cors: true,
    allowedHosts: ['31b5a7whu6-5173.cnb.run', '452.sdcom.asia', '452pic.netlify.app', 'localhost', '127.0.0.1'],
    fs: {
      // 允许为项目根目录上一级的文件提供服务
      allow: ['..']
    }
  },
  // 配置静态资源处理
  publicDir: 'public',
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: 'hidden',
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