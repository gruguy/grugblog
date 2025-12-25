<template>
  <MainLayout>
    <div class="max-w-6xl mx-auto mt-12">
      <div class="bg-card border border-border rounded-lg shadow-md p-8">
        <!-- 用户信息卡片 -->
        <div class="flex flex-col md:flex-row gap-8 mb-12">
          <!-- 左侧：头像和基本信息 -->
          <div class="md:w-1/3">
            <div class="flex flex-col items-center">
              <div class="relative mb-4">
                <div
                  v-if="!userStore.user?.avatar"
                  class="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-2xl border-4 border-primary"
                >
                  {{ userStore.user?.username.charAt(0).toUpperCase() || 'U' }}
                </div>
                <img
                  v-else
                  :src="userStore.user?.avatar"
                  alt="头像"
                  class="w-32 h-32 rounded-full object-cover border-4 border-primary"
                />
                <button
                  class="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full border-2 border-card hover:bg-primary/90 transition-colors"
                  @click="triggerFileInput"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                  </svg>
                </button>
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleAvatarUpload"
                />
              </div>
              <h2 class="text-2xl font-bold mb-2">{{ userStore.user?.username || '用户' }}</h2>
              <p class="text-muted-foreground mb-4">{{ userStore.user?.email || '未设置邮箱' }}</p>
              <div class="flex space-x-4 mb-4">
                <div class="text-center">
                  <div class="text-xl font-bold">{{ likedArticles.length }}</div>
                  <div class="text-sm text-muted-foreground">点赞</div>
                </div>
                <div class="text-center">
                  <div class="text-xl font-bold">{{ collectedArticles.length }}</div>
                  <div class="text-sm text-muted-foreground">收藏</div>
                </div>
              </div>
            </div>
          </div>
          <!-- 右侧：详细信息 -->
          <div class="md:w-2/3">
            <h3 class="text-xl font-bold mb-4">个人信息</h3>
            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium mb-1">用户名</label>
                  <p class="text-foreground">{{ userStore.user?.username || '未设置' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">邮箱</label>
                  <p class="text-foreground">{{ userStore.user?.email || '未设置' }}</p>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">昵称</label>
                <p class="text-foreground">{{ userStore.user?.nickname || '未设置' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">个人简介</label>
                <p class="text-foreground">{{ userStore.user?.bio || '未设置' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 内容标签页 -->
        <div class="border-t border-border">
          <div class="flex space-x-8 mb-8">
            <button
              @click="activeTab = 'liked'"
              :class="['py-4 text-sm font-medium transition-colors', activeTab === 'liked' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground']"
            >
              点赞内容
            </button>
            <button
              @click="activeTab = 'collected'"
              :class="['py-4 text-sm font-medium transition-colors', activeTab === 'collected' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground']"
            >
              收藏内容
            </button>
          </div>

          <!-- 点赞内容 -->
          <div v-if="activeTab === 'liked'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              v-for="article in likedArticles"
              :key="article.id"
              class="bg-muted rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <h3 class="text-lg font-bold mb-2 text-foreground hover:text-primary transition-colors">
                <router-link :to="`/article/${article.id}`">{{ article.title }}</router-link>
              </h3>
              <p class="text-muted-foreground text-sm mb-3 line-clamp-2">{{ article.summary }}</p>
              <div class="flex items-center justify-between text-xs text-muted-foreground">
                <span>{{ new Date(article.createdAt).toLocaleDateString() }}</span>
                <span>{{ article.views }} 阅读 · {{ article.likes }} 点赞</span>
              </div>
            </div>
            <div v-if="likedArticles.length === 0" class="col-span-1 md:col-span-2 text-center py-12 text-muted-foreground">
              还没有点赞内容
            </div>
          </div>

          <!-- 收藏内容 -->
          <div v-if="activeTab === 'collected'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              v-for="article in collectedArticles"
              :key="article.id"
              class="bg-muted rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <h3 class="text-lg font-bold mb-2 text-foreground hover:text-primary transition-colors">
                <router-link :to="`/article/${article.id}`">{{ article.title }}</router-link>
              </h3>
              <p class="text-muted-foreground text-sm mb-3 line-clamp-2">{{ article.summary }}</p>
              <div class="flex items-center justify-between text-xs text-muted-foreground">
                <span>{{ new Date(article.createdAt).toLocaleDateString() }}</span>
                <span>{{ article.views }} 阅读 · {{ article.likes }} 点赞</span>
              </div>
            </div>
            <div v-if="collectedArticles.length === 0" class="col-span-1 md:col-span-2 text-center py-12 text-muted-foreground">
              还没有收藏内容
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
const activeTab = ref('liked')
const fileInput = ref<HTMLInputElement | null>(null)

// 模拟数据，实际需要从API获取
const likedArticles = ref([
  {
    id: 1,
    title: 'Vue3 入门教程',
    summary: 'Vue3 是一款流行的 JavaScript 框架，用于构建用户界面。',
    views: 1234,
    likes: 56,
    createdAt: '2023-12-25'
  },
  {
    id: 2,
    title: 'NestJS 后端开发',
    summary: 'NestJS 是一个用于构建高效、可扩展的 Node.js 服务器端应用程序的框架。',
    views: 890,
    likes: 45,
    createdAt: '2023-12-24'
  }
])

const collectedArticles = ref([
  {
    id: 3,
    title: 'TypeScript 类型系统详解',
    summary: 'TypeScript 是 JavaScript 的一个超集，添加了静态类型定义。',
    views: 1567,
    likes: 78,
    createdAt: '2023-12-23'
  }
])

// 触发文件选择
const triggerFileInput = () => {
  fileInput.value?.click()
}

// 处理头像上传
const handleAvatarUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    const file = input.files[0]
    // 这里需要实现头像上传逻辑
    console.log('上传头像:', file)
    // 实际项目中应该调用上传API，然后更新用户头像
    // await userStore.updateAvatar(file)
    alert('头像上传功能还未实现')
  }
}

onMounted(() => {
  // 检查登录状态
  if (!userStore.isLoggedIn) {
    // 重定向到登录页
    window.location.href = '/login'
  }
})
</script>
