import { createApp } from 'vue'
import {
  create,
  NConfigProvider,
  NLayout,
  NLayoutHeader,
  NLayoutContent,
  NButton,
  NModal,
  NEmpty,
  NIcon,
  NSpin
} from 'naive-ui'
import VueLazyload from 'vue-lazyload'
import App from './App.vue'

const naive = create({
  components: [
    NConfigProvider,
    NLayout,
    NLayoutHeader,
    NLayoutContent,
    NButton,
    NModal,
    NEmpty,
    NIcon,
    NSpin
  ]
})

const app = createApp(App)

// 配置 vue-lazyload
app.use(VueLazyload, {
  preLoad: 1.3, // 预加载高度比例
  error: '/placeholder-error.png', // 加载失败时显示的图片
  loading: '/placeholder-loading.png', // 加载中显示的图片
  attempt: 2, // 尝试加载次数
  observer: true, // 使用 IntersectionObserver
  observerOptions: {
    rootMargin: '50px', // 提前 50px 开始加载
    threshold: 0.1 // 当图片 10% 进入视口时开始加载
  }
})

app.use(naive)
app.mount('#app')