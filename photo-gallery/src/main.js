import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Naive UI
import {
  create,
  NButton,
  NLayout,
  NLayoutHeader,
  NLayoutContent,
  NSelect,
  NSpin,
  NEmpty,
  NModal,
  NInput,
  NIcon,
} from 'naive-ui'

const naive = create({
  components: [
    NButton,
    NLayout,
    NLayoutHeader,
    NLayoutContent,
    NSelect,
    NSpin,
    NEmpty,
    NModal,
    NInput,
    NIcon,
  ]
})

const app = createApp(App)

app.use(router)
app.use(naive)

app.mount('#app')