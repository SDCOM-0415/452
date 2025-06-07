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
  NIcon
} from 'naive-ui'
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
    NIcon
  ]
})

const app = createApp(App)
app.use(naive)
app.mount('#app')