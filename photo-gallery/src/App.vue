<template>
  <n-config-provider :theme="theme">
    <n-message-provider>
      <router-view></router-view>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup>
import { NConfigProvider, NMessageProvider, darkTheme } from 'naive-ui'
import { ref } from 'vue'

const theme = ref(null) // 设置为 darkTheme 可以启用暗色主题
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

#app {
  height: 100%;
}

img {
  max-width: 100%;
  height: auto;
}
</style>