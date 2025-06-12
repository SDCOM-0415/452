<template>
  <n-config-provider :theme="theme">
    <n-message-provider>
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup>
import { ref, provide, onMounted, getCurrentInstance } from 'vue'
import { darkTheme, lightTheme } from 'naive-ui'

const theme = ref(lightTheme)

const toggleTheme = () => {
  theme.value = theme.value === lightTheme ? darkTheme : lightTheme
  // 保存主题偏好到本地存储
  localStorage.setItem('theme', theme.value === darkTheme ? 'dark' : 'light')
}

// 使用 provide 提供主题状态和切换函数
provide('theme', theme)
provide('toggleTheme', toggleTheme)

// 同时也设置为全局属性，以便在非组件环境中使用
onMounted(() => {
  const app = getCurrentInstance()?.appContext.app
  if (app) {
    app.config.globalProperties.theme = theme
    app.config.globalProperties.toggleTheme = toggleTheme
  }
  
  // 从本地存储中恢复主题设置
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    theme.value = darkTheme
  }

  // 初始化密码保护设置
  if (localStorage.getItem('needPassword') === null) {
    localStorage.setItem('needPassword', 'true')
  }
  if (localStorage.getItem('passwordVerified') === null) {
    localStorage.setItem('passwordVerified', 'false')
  }
})
</script>

<style>
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
}

h1 {
  margin: 0;
}

.footer {
  text-align: center;
  padding: 16px 0;
  font-size: 14px;
  border-top: 1px solid #e8e8e8;
}

.footer a {
  text-decoration: none;
  color: #18a058;
  font-weight: 500;
}

.footer a:hover {
  text-decoration: underline;
}
</style>