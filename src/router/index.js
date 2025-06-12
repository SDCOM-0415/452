import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/password',
      name: 'password',
      component: () => import('../views/PasswordView.vue')
    }
  ]
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 检查是否需要密码验证
  const needPassword = localStorage.getItem('needPassword') === 'true'
  const hasVerified = sessionStorage.getItem('passwordVerified') === 'true'

  if (needPassword && !hasVerified && to.name !== 'password') {
    // 需要密码但未验证，重定向到密码页面
    next({ name: 'password' })
  } else if ((!needPassword || hasVerified) && to.name === 'password') {
    // 不需要密码或已验证，但访问密码页面，重定向到首页
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router