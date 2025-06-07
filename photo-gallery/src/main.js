import { createApp } from 'vue'
import App from './App.vue'
import naive from 'naive-ui'
import VueLazyload from 'vue-lazyload'

const CDN_PREFIX = 'https://my.xiguacity.cn/study/239904223/684412c92d1be91a5cc169dc'

const app = createApp(App)

app.use(naive)
app.use(VueLazyload, {
  preLoad: 1.3,
  loading: `${CDN_PREFIX}/placeholder-loading.svg`,
  error: `${CDN_PREFIX}/placeholder-error.svg`,
  attempt: 3,
  lazyComponent: true
})

app.mount('#app')