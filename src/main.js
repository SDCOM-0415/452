import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import naive from 'naive-ui'
import VueLazyload from 'vue-lazyload'

const CDN_PREFIX = 'https://my.xiguacity.cn/study/239904223/684412c92d1be91a5cc169dc'

const app = createApp(App)

// 使用路由
app.use(router)

// 使用 Naive UI
app.use(naive)

// 使用 VueLazyload
app.use(VueLazyload, {
  preLoad: 1.3,
  loading: `${CDN_PREFIX}/placeholder-loading.svg`,
  error: `${CDN_PREFIX}/placeholder-error.svg`,
  attempt: 3,
  lazyComponent: true
})

app.mount('#app')