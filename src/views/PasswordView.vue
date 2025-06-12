<template>
  <n-layout position="absolute">
    <n-layout-content>
      <div class="password-container">
        <n-card title="请输入访问密码" :bordered="false" size="large">
          <n-form
            ref="formRef"
            :model="formValue"
            :rules="rules"
            @keyup.enter="handleSubmit"
          >
            <n-form-item path="password" label="密码">
              <n-input
                v-model:value="formValue.password"
                type="password"
                placeholder="请输入密码"
                :maxlength="20"
                show-password-on="click"
              />
            </n-form-item>

            <div class="action-buttons">
              <n-button
                type="primary"
                block
                @click="handleSubmit"
                :loading="loading"
              >
                验证
              </n-button>
            </div>
          </n-form>
        </n-card>
      </div>
    </n-layout-content>
  </n-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'

const router = useRouter()
const message = useMessage()

const formRef = ref(null)
const loading = ref(false)
const formValue = ref({
  password: ''
})

const rules = {
  password: {
    required: true,
    message: '请输入密码',
    trigger: ['blur', 'input']
  }
}

const handleSubmit = (e) => {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      loading.value = true
      try {
        // 这里替换为实际的密码
        const correctPassword = '123456'
        
        if (formValue.value.password === correctPassword) {
          // 密码正确
          localStorage.setItem('passwordVerified', 'true')
          message.success('验证成功')
          router.push('/')
        } else {
          // 密码错误
          message.error('密码错误，请重试')
          formValue.value.password = ''
        }
      } catch (error) {
        message.error('验证过程出现错误，请重试')
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped>
.password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #f5f5f5;
}

.n-card {
  width: 100%;
  max-width: 400px;
}

.action-buttons {
  margin-top: 24px;
}
</style>