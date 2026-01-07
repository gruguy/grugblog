<template>
    <div class="text-center py-12">
      <h2 class="text-2xl font-bold mb-4">正在跳转到登录页面...</h2>
      <p class="text-muted-foreground">如果您没有自动跳转，请点击下方按钮</p>
      <button
        @click="openLoginModal"
        class="mt-4 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
      >
        打开登录弹窗
      </button>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'


const router = useRouter()

// 打开登录弹窗（通过事件总线或其他方式，这里直接重定向）
const openLoginModal = () => {
  router.push('/')
}

// 组件挂载时，重定向到首页并通过查询参数指示打开登录弹窗
onMounted(() => {
  router.push({
    path: '/',
    query: { modal: 'login' }
  })
})
</script>
