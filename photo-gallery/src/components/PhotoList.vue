<template>
  <div class="photo-container">
    <div v-if="loading" class="loading">
      加载中...
    </div>
    <n-empty v-else-if="photos.length === 0" description="没有找到照片" />
    <div v-else class="photo-grid">
      <div v-for="(photo, index) in photos" :key="index" class="photo-item" @click="showPhoto(photo)">
        <img :src="`/pic/${photo}`" :alt="photo" />
      </div>
    </div>

    <n-modal v-model:show="showModal" preset="card" style="width: 80%; max-width: 1200px;">
      <template #header>
        <div>{{ currentPhoto }}</div>
      </template>
      <div class="modal-content">
        <img v-if="currentPhoto" :src="`/pic/${currentPhoto}`" :alt="currentPhoto" />
      </div>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const photos = ref([])
const loading = ref(true)
const showModal = ref(false)
const currentPhoto = ref(null)

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

const showPhoto = (photo) => {
  currentPhoto.value = photo
  showModal.value = true
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
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 18px;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.photo-item {
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

.modal-content {
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content img {
  max-width: 100%;
  max-height: 80vh;
}
</style>