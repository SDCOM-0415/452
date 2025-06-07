<template>
  <div class="home-container">
    <n-layout>
      <n-layout-header class="header">
        <h1>毕业照片浏览</h1>
        <div class="header-controls">
          <n-select
            v-model:value="currentCategory"
            :options="categoryOptions"
            placeholder="选择分类"
            style="width: 200px; margin-right: 16px;"
          />
          <n-button @click="showCategoryModal = true">
            管理分类
          </n-button>
        </div>
      </n-layout-header>
      
      <n-layout-content class="content">
        <div v-if="loading" class="loading-container">
          <n-spin size="large" />
          <p>加载照片中...</p>
        </div>
        
        <div v-else-if="filteredPhotos.length === 0" class="empty-container">
          <n-empty description="没有找到照片" />
        </div>
        
        <div v-else class="photo-grid">
          <div 
            v-for="photo in filteredPhotos" 
            :key="photo.path" 
            class="photo-item"
            @click="openPhotoViewer(photo)"
          >
            <img :src="photo.path" :alt="photo.name" />
            <div class="photo-info">
              <p class="photo-time">{{ formatTime(photo.time) }}</p>
              <p class="photo-name">{{ photo.name }}</p>
            </div>
          </div>
        </div>
      </n-layout-content>
    </n-layout>
    
    <!-- 照片查看器 -->
    <n-modal
      v-model:show="showPhotoViewer"
      preset="card"
      style="width: 80vw; max-width: 1200px;"
      :title="currentPhoto?.name || ''"
      :bordered="false"
    >
      <div class="photo-viewer">
        <img v-if="currentPhoto" :src="currentPhoto.path" :alt="currentPhoto.name" />
        <div class="photo-controls">
          <n-button @click="prevPhoto" :disabled="currentPhotoIndex <= 0">
            上一张
          </n-button>
          <span>{{ currentPhotoIndex + 1 }} / {{ filteredPhotos.length }}</span>
          <n-button @click="nextPhoto" :disabled="currentPhotoIndex >= filteredPhotos.length - 1">
            下一张
          </n-button>
        </div>
        <div class="photo-details">
          <p><strong>时间:</strong> {{ currentPhoto ? formatTime(currentPhoto.time) : '' }}</p>
          <p>
            <strong>分类:</strong> 
            <n-select
              v-if="currentPhoto"
              v-model:value="currentPhoto.category"
              :options="categoryOptions"
              @update:value="updatePhotoCategory(currentPhoto, $event)"
              style="width: 200px; display: inline-block; margin-left: 8px;"
            />
          </p>
        </div>
      </div>
    </n-modal>
    
    <!-- 分类管理 -->
    <n-modal
      v-model:show="showCategoryModal"
      preset="card"
      style="width: 500px;"
      title="管理分类"
    >
      <div class="category-manager">
        <div class="category-list">
          <div v-for="(category, index) in categories" :key="index" class="category-item">
            <n-input v-model:value="categories[index]" placeholder="分类名称" />
            <n-button quaternary circle type="error" @click="removeCategory(index)">
              <template #icon>
                <n-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 21q-.825 0-1.413-.588T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.588 1.413T17 21H7ZM17 6H7v13h10V6ZM9 17h2V8H9v9Zm4 0h2V8h-2v9ZM7 6v13V6Z"/></svg></n-icon>
              </template>
            </n-button>
          </div>
        </div>
        <div class="category-actions">
          <n-button @click="addCategory">添加分类</n-button>
          <n-button type="primary" @click="saveCategories">保存</n-button>
        </div>
      </div>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStorage } from '@vueuse/core'

// 状态
const photos = ref([])
const loading = ref(true)
const showPhotoViewer = ref(false)
const currentPhoto = ref(null)
const currentPhotoIndex = ref(0)
const showCategoryModal = ref(false)

// 分类相关
const categories = useStorage('photo-categories', ['全部', '上午', '下午', '集体照', '个人照'])
const currentCategory = ref('全部')

const categoryOptions = computed(() => {
  return categories.value.map(cat => ({
    label: cat,
    value: cat
  }))
})

// 过滤后的照片
const filteredPhotos = computed(() => {
  if (currentCategory.value === '全部') {
    return photos.value
  }
  return photos.value.filter(photo => photo.category === currentCategory.value)
})

// 加载照片
async function loadPhotos() {
  loading.value = true
  try {
    // 在实际应用中，这里会从服务器或文件系统获取照片
    // 这里我们模拟从 2025.6.7 文件夹加载照片
    const photoList = []
    
    // 这里我们假设照片已经在 public 目录下
    // 在实际部署时，需要将照片复制到 public 目录
    const folderPath = '/2025.6.7/'
    
    // 这里我们模拟从文件名中提取时间信息
    // 实际应用中，这部分会根据实际的文件名格式调整
    const photoFiles = await fetch('/photo-list.json')
      .then(res => res.json())
      .catch(() => [])
    
    photoFiles.forEach(file => {
      // 从文件名中提取时间信息
      // 假设格式为 IMG_20250607_091127.jpg
      const match = file.match(/IMG_(\d{8})_(\d{6})/)
      if (match) {
        const dateStr = match[1] // 20250607
        const timeStr = match[2] // 091127
        
        const year = dateStr.substring(0, 4)
        const month = dateStr.substring(4, 6)
        const day = dateStr.substring(6, 8)
        
        const hour = timeStr.substring(0, 2)
        const minute = timeStr.substring(2, 4)
        const second = timeStr.substring(4, 6)
        
        const timestamp = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`)
        
        // 根据时间自动分类
        let category = '全部'
        const hourNum = parseInt(hour)
        if (hourNum < 12) {
          category = '上午'
        } else {
          category = '下午'
        }
        
        photoList.push({
          name: file,
          path: folderPath + file,
          time: timestamp,
          category
        })
      }
    })
    
    // 按时间排序
    photoList.sort((a, b) => a.time - b.time)
    photos.value = photoList
  } catch (error) {
    console.error('加载照片失败:', error)
  } finally {
    loading.value = false
  }
}

// 格式化时间
function formatTime(time) {
  if (!time) return ''
  return new Date(time).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 照片查看器相关
function openPhotoViewer(photo) {
  currentPhoto.value = photo
  currentPhotoIndex.value = filteredPhotos.value.findIndex(p => p.path === photo.path)
  showPhotoViewer.value = true
}

function nextPhoto() {
  if (currentPhotoIndex.value < filteredPhotos.value.length - 1) {
    currentPhotoIndex.value++
    currentPhoto.value = filteredPhotos.value[currentPhotoIndex.value]
  }
}

function prevPhoto() {
  if (currentPhotoIndex.value > 0) {
    currentPhotoIndex.value--
    currentPhoto.value = filteredPhotos.value[currentPhotoIndex.value]
  }
}

// 分类管理
function addCategory() {
  categories.value.push('')
}

function removeCategory(index) {
  // 不允许删除"全部"分类
  if (categories.value[index] === '全部') return
  categories.value.splice(index, 1)
}

function saveCategories() {
  // 过滤掉空分类
  categories.value = categories.value.filter(cat => cat.trim() !== '')
  
  // 确保"全部"分类存在
  if (!categories.value.includes('全部')) {
    categories.value.unshift('全部')
  }
  
  showCategoryModal.value = false
}

function updatePhotoCategory(photo, category) {
  photo.category = category
  // 在实际应用中，这里可能需要保存到服务器或本地存储
}

// 生命周期
onMounted(() => {
  loadPhotos()
})
</script>

<style scoped>
.home-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.header-controls {
  display: flex;
  align-items: center;
}

.content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.loading-container, .empty-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}

.photo-item {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;
}

.photo-item:hover {
  transform: scale(1.02);
}

.photo-item img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.photo-info {
  padding: 8px 12px;
}

.photo-time {
  font-size: 12px;
  color: #666;
  margin: 0;
}

.photo-name {
  font-size: 14px;
  margin: 4px 0 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.photo-viewer {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.photo-viewer img {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
}

.photo-controls {
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.photo-details {
  margin-top: 16px;
  width: 100%;
}

.category-manager {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}
</style>