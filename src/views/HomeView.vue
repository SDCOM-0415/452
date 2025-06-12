<template>
  <n-layout position="absolute">
    <n-layout-header style="padding: 24px">
      <div class="header">
        <h1>照片库</h1>
        <n-button @click="toggleTheme">
          切换{{ theme === darkTheme ? '浅色' : '深色' }}主题
        </n-button>
      </div>
    </n-layout-header>
    <n-layout-content>
      <photo-list />
    </n-layout-content>
    <n-layout-footer class="footer">
      <p>Powered by <a href="https://www.sdcom.asia" target="_blank">SDCOM</a> © 2025</p>
    </n-layout-footer>
  </n-layout>
</template>

<script setup>
import { inject } from 'vue'
import { darkTheme } from 'naive-ui'
import PhotoList from '../components/PhotoList.vue'

// 从 App.vue 注入主题状态和切换函数
const theme = inject('theme')
const toggleTheme = inject('toggleTheme')
</script>

<style scoped>
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