<template>
  <n-config-provider :theme="theme">
    <n-layout>
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
    </n-layout>
  </n-config-provider>
</template>

<script setup>
import { ref } from 'vue'
import { darkTheme, lightTheme } from 'naive-ui'
import PhotoList from './components/PhotoList.vue'

const theme = ref(lightTheme)

const toggleTheme = () => {
  theme.value = theme.value === lightTheme ? darkTheme : lightTheme
}
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
</style>