<template>
  <div class="flex flex-col items-center justify-center py-16">
    <div class="text-center">
      <div class="mb-4">
        <svg class="w-24 h-24 mx-auto text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7a2 2 0 002 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 Module not found: Error: Cannot find module '@/common/guards/jwt-auth.guard'
</path>
          </svg>
      </div>
      <h3 class="text-xl font-semibold text-foreground mb-2">{{ title || '暂无数据' }}</h3>
      <p class="text-muted-foreground mb-6">{{ description || '当前没有相关数据' }}</p>
      <button
        v-if="showAction"
        @click="$emit('action')"
        class="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
      >
        {{ actionText || '重新加载' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
  showAction?: boolean
  actionText?: string
}>()
</script>