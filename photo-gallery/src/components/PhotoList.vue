<template>
  <div class="photo-list">
    <n-empty v-if="photos.length === 0" description="暂无照片">
      <template #extra>
        <n-button @click="refreshPhotos">刷新列表</n-button>
      </template>
    </n-empty>
    
    <div v-else class="grid">
      <div v-for="(photo, index) in photos" :key="photo" class="photo-item" @click="openViewer(index)">
        <img :src="getImageUrl(photo)" :alt="photo" loading="lazy" />
        <div class="photo-info">
          <span class="time">{{ formatTime(photo) }}</span>
        </div>
      </div>
    </div>

    <n-modal
      v-model:show="showViewer"
      preset="card"
      :style="{ maxWidth: '90vw', maxHeight: '90vh' }"
      :mask-closable="true"
      @after-leave="handleModalClose"
    >
      <div class="viewer" @click="showViewer = false">
        <img
          v-if="currentPhoto"
          :src="getImageUrl(currentPhoto)"
          :alt="currentPhoto"
          class="viewer-image"
        />
        <div class="viewer-controls">
          <n-button
            circle
            @click.stop="prevPhoto"
            :disabled="currentIndex <= 0"
          >
            <template #icon>
              <n-icon><arrow-back /></n-icon>
            </template>
          </n-button>
          <n-button
            circle
            @click.stop="nextPhoto"
            :disabled="currentIndex >= photos.length - 1"
          >
            <template #icon>
              <n-icon><arrow-forward /></n-icon>
            </template>
          </n-button>
        </div>
      </div>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ArrowBack, ArrowForward } from '@vicons/ionicons5'
import { useEventListener } from '@vueuse/core'

const photos = ref([])
const showViewer = ref(false)
const currentIndex = ref(0)
const currentPhoto = ref(null)

// 获取图片URL
const getImageUrl = (filename) => {
  return `${import.meta.env.BASE_URL}pic/${filename}`
}

// 加载照片列表
const loadPhotos = async () => {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}photo-list.json`)
    const data = await response.json()
    photos.value = data.sort() // 按文件名排序
  } catch (error) {
    console.error('加载照片列表失败:', error)
  }
}

// 刷新照片列表
const refreshPhotos = () => {
  loadPhotos()
}

// 格式化时间
const formatTime = (filename) => {
  // 尝试从文件名中提取时间信息
  const match = filename.match(/(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})/)
  if (match) {
    const [_, year, month, day, hour, minute, second] = match
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
  }
  return filename
}

// 打开查看器
const openViewer = (index) => {
  currentIndex.value = index
  currentPhoto.value = photos.value[index]
  showViewer.value = true
}

// 上一张照片
const prevPhoto = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    currentPhoto.value = photos.value[currentIndex.value]
  }
}

// 下一张照片
const nextPhoto = () => {
  if (currentIndex.value < photos.value.length - 1) {
    currentIndex.value++
    currentPhoto.value = photos.value[currentIndex.value]
  }
}

// 处理模态框关闭
const handleModalClose = () => {
  currentPhoto.value = null
}

// 键盘事件处理
const handleKeyDown = (e) => {
  if (!showViewer.value) return
  
  switch (e.key) {
    case 'ArrowLeft':
      prevPhoto()
      break
    case 'ArrowRight':
      nextPhoto()
      break
    case 'Escape':
      showViewer.value = false
      break
  }
}

// 监听键盘事件
useEventListener(window, 'keydown', handleKeyDown)

// 组件挂载时加载照片
onMounted(() => {
  loadPhotos()
})
</script>

<style scoped>
.photo-list {
  padding: 20px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px;
}

.photo-item {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
}

.photo-item:hover {
  transform: scale(1.02);
}

.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 12px;
}

.time {
  display: block;
  text-align: center;
}

.viewer {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;
}

.viewer-image {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
}

.viewer-controls {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 20px;
  background: rgba(0, 0, 0, 0.6);
  padding: 10px;
  border-radius: 20px;
}
</style>