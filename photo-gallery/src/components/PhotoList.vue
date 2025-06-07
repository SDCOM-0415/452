<template>
  <div class="photo-container">
    <div v-if="loading" class="loading">
      <n-spin size="large" />
      <p>正在加载照片...</p>
    </div>
    <n-empty v-else-if="photos.length === 0" description="没有找到照片" />
    <template v-else>
      <div class="photo-grid">
        <div
          v-for="(photo, index) in displayedPhotos"
          :key="index"
          class="photo-item"
          @click="showPhoto(photo)"
        >
          <img v-lazy="`/pic/${photo}`" :alt="photo" />
          <div class="photo-overlay">
            <n-icon size="24">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14z"/>
              </svg>
            </n-icon>
          </div>
        </div>
      </div>

      <div v-if="hasMorePhotos" class="load-more">
        <n-button
          type="primary"
          @click="loadMorePhotos"
          :loading="loadingMore"
        >
          加载更多照片
        </n-button>
      </div>

      <n-modal
        v-model:show="showModal"
        preset="card"
        style="width: 90%; max-width: 1200px;"
        :mask-closable="true"
      >
        <template #header>
          <div class="modal-header">
            <span>{{ currentPhotoIndex + 1 }} / {{ photos.length }}</span>
            <div class="modal-controls">
              <n-button
                circle
                secondary
                :disabled="currentPhotoIndex === 0"
                @click="showPreviousPhoto"
              >
                ←
              </n-button>
              <n-button
                circle
                secondary
                :disabled="currentPhotoIndex === photos.length - 1"
                @click="showNextPhoto"
              >
                →
              </n-button>
            </div>
          </div>
        </template>
        <div class="modal-content">
          <img
            v-if="currentPhoto"
            v-lazy="`/pic/${currentPhoto}`"
            :alt="currentPhoto"
            @load="preloadAdjacentPhotos"
          />
        </div>
      </n-modal>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const PHOTOS_PER_PAGE = 20 // 每页显示的照片数量

const photos = ref([])
const loading = ref(true)
const loadingMore = ref(false)
const showModal = ref(false)
const currentPhoto = ref(null)
const currentPage = ref(1)

const displayedPhotos = computed(() => {
  return photos.value.slice(0, currentPage.value * PHOTOS_PER_PAGE)
})

const hasMorePhotos = computed(() => {
  return displayedPhotos.value.length < photos.value.length
})

const currentPhotoIndex = computed(() => {
  return photos.value.indexOf(currentPhoto.value)
})

const loadPhotos = async () => {
  try {
    const response = await fetch('/photo-list.json')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    photos.value = await response.json()
  } catch (error) {
    console.error('Error loading photos:', error)
  } finally {
    loading.value = false
  }
}

const loadMorePhotos = async () => {
  loadingMore.value = true
  await new Promise(resolve => setTimeout(resolve, 500)) // 添加小延迟使加载动画更明显
  currentPage.value++
  loadingMore.value = false
}

const showPhoto = (photo) => {
  currentPhoto.value = photo
  showModal.value = true
}

const showPreviousPhoto = () => {
  const index = currentPhotoIndex.value
  if (index > 0) {
    currentPhoto.value = photos.value[index - 1]
    preloadAdjacentPhotos()
  }
}

const showNextPhoto = () => {
  const index = currentPhotoIndex.value
  if (index < photos.value.length - 1) {
    currentPhoto.value = photos.value[index + 1]
    preloadAdjacentPhotos()
  }
}

const preloadAdjacentPhotos = () => {
  const index = currentPhotoIndex.value
  const preloadImages = []

  // 预加载前后各两张图片
  for (let i = -2; i <= 2; i++) {
    const preloadIndex = index + i
    if (preloadIndex >= 0 && preloadIndex < photos.value.length && i !== 0) {
      const img = new Image()
      img.src = `/pic/${photos.value[preloadIndex]}`
      preloadImages.push(img)
    }
  }
}

onMounted(() => {
  loadPhotos()
})
</script>

<style scoped>
.photo-container {
  padding: 24px;
}

.loading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  gap: 16px;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.photo-item {
  position: relative;
  cursor: pointer;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  aspect-ratio: 1;
}

.photo-item:hover {
  transform: scale(1.05);
}

.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: white;
}

.photo-item:hover .photo-overlay {
  opacity: 1;
}

.modal-content {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.modal-content img {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-controls {
  display: flex;
  gap: 8px;
}

.load-more {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

/* 添加图片加载状态样式 */
img[lazy="loading"] {
  opacity: 0.5;
  transition: opacity 0.3s;
}

img[lazy="loaded"] {
  opacity: 1;
  transition: opacity 0.3s;
}

img[lazy="error"] {
  opacity: 0.5;
  transition: opacity 0.3s;
}
</style>