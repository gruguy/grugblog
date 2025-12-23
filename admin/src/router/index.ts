import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: {
      title: '登录',
      requiresAuth: false,
    },
  },
  {
    path: '/',
    component: () => import('@/layouts/AdminLayout.vue'),
    redirect: '/dashboard',
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: {
          title: '仪表盘',
        },
      },
      {
        path: 'articles',
        name: 'Articles',
        component: () => import('@/views/articles/ArticleList.vue'),
        meta: {
          title: '文章列表',
        },
      },
      {
        path: 'article-categories',
        name: 'ArticleCategories',
        component: () => import('@/views/articles/CategoryList.vue'),
        meta: {
          title: '文章分类管理',
        },
      },
      {
        path: 'articles/create',
        name: 'ArticleCreate',
        component: () => import('@/views/articles/ArticleForm.vue'),
        meta: {
          title: '创建文章',
        },
      },
      {
        path: 'articles/edit/:id',
        name: 'ArticleEdit',
        component: () => import('@/views/articles/ArticleForm.vue'),
        meta: {
          title: '编辑文章',
        },
      },
      {
        path: 'music',
        name: 'Music',
        component: () => import('@/views/Music.vue'),
        meta: {
          title: '音乐管理',
        },
      },
      {
        path: 'images',
        name: 'Images',
        component: () => import('@/views/Images.vue'),
        meta: {
          title: '图片管理',
        },
      },
      {
        path: 'videos',
        name: 'Videos',
        component: () => import('@/views/Videos.vue'),
        meta: {
          title: '视频管理',
        },
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/Settings.vue'),
        meta: {
          title: '系统设置',
        },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  document.title = to.meta.title ? `${to.meta.title} - 后台管理` : '后台管理'
  
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/login')
  } else if (to.path === '/login' && userStore.isLoggedIn) {
    next('/')
  } else {
    next()
  }
})

export default router

